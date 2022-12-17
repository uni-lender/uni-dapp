import {
  Dialog,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { BorrowRow } from '../MyBorrowTable';
import { StyledCircularProgress } from '../SupplyERC20Modal';

import { TokenIcon } from '@/components/tokenIcon';
import { useWeb3Context } from '@/contexts/web3Context';
import { Erc20Reverse__factory, Erc20__factory } from '@/contracts';
import {
  ERC20_RESERVE_ADDRESS,
  WETH_ADDRESS,
} from '@/static/constants/contract';
import { formatWETH } from '@/utils/format';
import { SuccessToast } from '@/components/successToast';
export type RepayModalProps = {
  open: boolean;
  onClose?: () => void;
  repayData: BorrowRow;
};
const ContentWrap = styled.div`
  background: #eee;
  border-radius: 4px;
  padding: 20px;
  text-align: left;
  width: 400px;
  margin: 20px 0;
  p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
  }
`;
export const RepayModal = ({ open, onClose, repayData }: RepayModalProps) => {
  const [value, setValue] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setValue(e.target.value);
      return;
    }
    if (!/^\d+(\.\d*)?$/.test(e.target.value)) {
      return;
    }
    setValue(e.target.value);
  };
  const { account, signer } = useWeb3Context();
  const [borrowValue, setBorrowValue] = useState('');
  useEffect(() => {
    const getCurrentBorrow = async () => {
      if (!signer || !account) {
        return;
      }
      const erc20Reserve = Erc20Reverse__factory.connect(
        ERC20_RESERVE_ADDRESS,
        signer
      );
      const ret = await erc20Reserve.accountBorrows(account);
      setBorrowValue(formatWETH(ret));
    };
    getCurrentBorrow();
  }, [account, signer]);

  const error = useMemo(() => {
    return (
      value !== '' &&
      (Number(value) === 0 || Number(value) > Number(borrowValue))
    );
  }, [value, borrowValue]);
  const handleClose = () => {
    setValue('');
    toggleLoading(false);
    onClose && onClose();
  };
  const [loading, toggleLoading] = useState(false);
  const [toastOpen, toggleToastOpen] = useState(false);
  const repayERC20 = async () => {
    try {
      toggleLoading(true);

      const erc20Reserve = Erc20Reverse__factory.connect(
        ERC20_RESERVE_ADDRESS,
        signer
      );
      const erc20 = Erc20__factory.connect(WETH_ADDRESS, signer);
      const amount = ethers.utils.parseUnits(value, 18);

      const tx = await erc20.approve(ERC20_RESERVE_ADDRESS, amount);
      await tx.wait();
      const repayTx = await erc20Reserve.repay(amount);
      repayTx.wait();

      toggleToastOpen(true);
      toggleLoading(false);
      handleClose();
    } catch (e) {
      console.log(e);
      toggleLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Repay {repayData?.name}</DialogTitle>
        <span style={{ textAlign: 'right' }}>
          Repay Limit: {borrowValue}WETH
        </span>
        <TextField
          onChange={handleChange}
          variant="outlined"
          error={error}
          helperText={error ? 'Invalid amount' : ''}
          InputProps={{
            startAdornment: (
              <TokenIcon
                name={repayData?.name}
                style={{ marginRight: '10px' }}
              />
            ),
          }}
          value={value}
          placeholder="0"
        />
        <ContentWrap>
          <DialogContentText>
            Borrowing: {borrowValue}WETH{' '}
            {value !== undefined && value !== '' && (
              <span
                style={{
                  color:
                    value && Number(value) > Number(borrowValue)
                      ? 'red'
                      : 'green',
                }}
              >
                -{value}WETH
              </span>
            )}
          </DialogContentText>
          <DialogContentText>
            Borrow APY: <span>{repayData?.borrowAPY}</span>
          </DialogContentText>
        </ContentWrap>
        <Button disabled={error || value === ''} onClick={repayERC20}>
          Repay {value === undefined ? 0 : value} {repayData.name}
          {loading && <StyledCircularProgress size={20} />}
        </Button>
      </Dialog>
      <SuccessToast
        open={toastOpen}
        onClose={() => toggleToastOpen(false)}
      ></SuccessToast>
    </>
  );
};
