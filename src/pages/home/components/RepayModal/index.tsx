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
  const error = useMemo(() => {
    return value !== '' && (Number(value) === 0 || Number(value) > 10);
  }, [value]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setValue('');
        onClose && onClose();
      }}
    >
      <DialogTitle>Repay {repayData?.name}</DialogTitle>
      <span style={{ textAlign: 'right' }}>Repay Limit: $30</span>
      <TextField
        onChange={handleChange}
        variant="outlined"
        error={error}
        helperText={error ? 'Invalid amount' : ''}
        InputProps={{
          startAdornment: (
            <TokenIcon name={repayData?.name} style={{ marginRight: '10px' }} />
          ),
        }}
        value={value}
        placeholder="0"
      />
      <ContentWrap>
        <DialogContentText>Borrowing: $30 </DialogContentText>
        <DialogContentText>
          Borrow APY: <span>{repayData?.borrowAPY}</span>
        </DialogContentText>
      </ContentWrap>
      <Button disabled={error || value === ''}>
        Repay {value === undefined ? 0 : value} {repayData.name}
      </Button>
    </Dialog>
  );
};
