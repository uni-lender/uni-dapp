import {
  Dialog,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

import { BorrowRow } from '../MyBorrowTable';

import { TokenIcon } from '@/components/tokenIcon';
import { Erc20Reverse__factory, Erc20__factory } from '@/contracts';
import {
  ERC20_RESERVE_ADDRESS,
  WETH_ADDRESS,
} from '@/static/constants/contract';
import { useWeb3Context } from '@/contexts/web3Context';
import { SuccessToast } from '@/components/successToast';
import { useUniContext } from '@/contexts/uniContext';
export type SupplyERC20ModalProps = {
  open: boolean;
  onClose?: () => void;
  supplyData: BorrowRow;
  successCallback?: () => void;
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
export const StyledCircularProgress = styled(CircularProgress)`
  color: var(--text-color) !important;
  margin-left: 10px;
`;
export const SupplyERC20Modal = ({
  open,
  onClose,
  supplyData,
  successCallback,
}: SupplyERC20ModalProps) => {
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
  const { walletBalance, borrowLimit } = useUniContext();

  const error = useMemo(() => {
    return (
      value !== '' &&
      (Number(value) === 0 || Number(value) > Number(walletBalance))
    );
  }, [value, walletBalance]);

  const { signer } = useWeb3Context();

  const handleClose = () => {
    setValue('');
    toggleLoading(false);
    onClose && onClose();
  };
  const [loading, toggleLoading] = useState(false);
  const [toastOpen, toggleToastOpen] = useState(false);
  const supplyERC20 = async () => {
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

      const supplyTx = await erc20Reserve.supply(amount);
      supplyTx.wait();
      toggleLoading(false);
      toggleToastOpen(true);
      handleClose();
      successCallback && successCallback();
    } catch (e) {
      console.log('error', e);
      toggleLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Supply {supplyData?.name}</DialogTitle>
        <span style={{ textAlign: 'right' }}>
          Supply Limit: {walletBalance}
          {supplyData.name}
        </span>
        <TextField
          onChange={handleChange}
          variant="outlined"
          error={error}
          helperText={error ? 'Invalid amount' : ''}
          InputProps={{
            startAdornment: (
              <TokenIcon
                name={supplyData?.name}
                style={{ marginRight: '10px' }}
              />
            ),
          }}
          value={value}
          placeholder="0"
        />
        <ContentWrap>
          <DialogContentText>
            Borrow Limit: {borrowLimit}WETH
            {value !== undefined && value !== '' && (
              <span
                style={{
                  color: value && Number(value) > 20 ? 'red' : 'green',
                }}
              >
                +{value}WETH
              </span>
            )}
          </DialogContentText>
        </ContentWrap>
        <Button
          disabled={error || value === '' || loading}
          onClick={supplyERC20}
        >
          Supply {value === undefined ? 0 : value} {supplyData.name}
          {loading && <StyledCircularProgress size={20} />}
        </Button>
      </Dialog>
      {toastOpen && (
        <SuccessToast open={toastOpen} onClose={() => toggleToastOpen(false)} />
      )}
    </>
  );
};
