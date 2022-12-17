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

import { TokenIcon } from '@/components/tokenIcon';
import { useWalletWETH } from '@/hooks/useWalletWETH';
import { Erc20Reverse__factory, Erc20__factory } from '@/contracts';
import {
  ERC20_RESERVE_ADDRESS,
  WETH_ADDRESS,
} from '@/static/constants/contract';
import { useWeb3Context } from '@/contexts/web3Context';
export type SupplyERC20ModalProps = {
  open: boolean;
  onClose?: () => void;
  supplyData: BorrowRow;
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
export const SupplyERC20Modal = ({
  open,
  onClose,
  supplyData,
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

  const { getWalletWETH } = useWalletWETH();
  const [walletBalance, setWalletBalance] = useState('');
  const [borrowedValue, setBorrowedValue] = useState('');

  const error = useMemo(() => {
    return (
      value !== '' &&
      (Number(value) === 0 || Number(value) > Number(walletBalance))
    );
  }, [value, walletBalance]);

  const { signer, account } = useWeb3Context();

  useEffect(() => {
    const getBalance = async () => {
      const ret = await getWalletWETH();
      setWalletBalance(ret ?? '');
    };
    getBalance();
  }, [getWalletWETH]);
  useEffect(() => {
    const getBorrowedValue = async () => {
      if (!signer || !account) {
        return;
      }
      const erc20Reserve = Erc20Reverse__factory.connect(
        ERC20_RESERVE_ADDRESS,
        signer
      );
      const obj = await erc20Reserve.balanceOf(account);
      setBorrowedValue(obj.toString());
    };
    getBorrowedValue();
  }, [account, signer]);
  const supplyERC20 = async () => {
    const erc20Reserve = Erc20Reverse__factory.connect(
      ERC20_RESERVE_ADDRESS,
      signer
    );

    const erc20 = Erc20__factory.connect(WETH_ADDRESS, signer);
    const amount = ethers.utils.parseUnits(value, 18);
    const tx = await erc20.approve(ERC20_RESERVE_ADDRESS, amount);
    const approveRet = await tx.wait();
    console.log('approveRet', approveRet);
    console.log('amount', amount.toString());
    const ret = await erc20Reserve.supply(amount);
    console.log('ret', ret);
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setValue('');
        onClose && onClose();
      }}
    >
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
          Borrowing: {borrowedValue}WETH
          {value !== undefined && value !== '' && (
            <span
              style={{
                color: value && Number(value) > 20 ? 'red' : 'green',
              }}
            >
              +{value}
            </span>
          )}
        </DialogContentText>
        <DialogContentText>
          Supply APY: <span>{supplyData?.supplyAPY}</span>
        </DialogContentText>
      </ContentWrap>
      <Button disabled={error || value === ''} onClick={supplyERC20}>
        Supply {value === undefined ? 0 : value} {supplyData.name}
      </Button>
    </Dialog>
  );
};
