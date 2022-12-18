import {
  Dialog,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from '@mui/material';
import { useState, useMemo } from 'react';
import styled from 'styled-components';

import { BorrowRow } from '../MyBorrowTable';

import { TokenIcon } from '@/components/tokenIcon';
import { useUniContext } from '@/contexts/uniContext';
export type WithdrawERC20ModalProps = {
  open: boolean;
  onClose?: () => void;
  withdrawData: BorrowRow;
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
export const WithdrawERC20Modal = ({
  open,
  onClose,
  withdrawData,
}: WithdrawERC20ModalProps) => {
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
  const error = useMemo(() => {
    return value !== '' && (Number(value) === 0 || Number(value) > 10);
  }, [value]);
  const { walletBalance } = useUniContext();

  return (
    <Dialog
      open={open}
      onClose={() => {
        setValue('');
        onClose && onClose();
      }}
    >
      <DialogTitle>Withdraw {withdrawData?.name}</DialogTitle>
      <span style={{ textAlign: 'right' }}>
        Withdraw Limit: {walletBalance}
        {withdrawData.name}
      </span>
      <TextField
        onChange={handleChange}
        variant="outlined"
        error={error}
        helperText={error ? 'Invalid amount' : ''}
        InputProps={{
          startAdornment: (
            <TokenIcon
              name={withdrawData?.name}
              style={{ marginRight: '10px' }}
            />
          ),
        }}
        value={value}
        placeholder="0"
      />
      <ContentWrap>
        <DialogContentText>
          Borrowing: $30{' '}
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
      </ContentWrap>
      <Button disabled={error || value === ''}>
        Withdraw {value === undefined ? 0 : value} {withdrawData.name}
      </Button>
    </Dialog>
  );
};
