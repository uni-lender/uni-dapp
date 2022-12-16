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
export type BorrowModalProps = {
  open: boolean;
  onClose?: () => void;
  borrowData: BorrowRow;
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
export const BorrowModal = ({
  open,
  onClose,
  borrowData,
}: BorrowModalProps) => {
  const [value, setValue] = useState<undefined | string>(undefined);
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
    return value !== undefined && (Number(value) === 0 || Number(value) > 10);
  }, [value]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        setValue(undefined);
        onClose && onClose();
      }}
    >
      <DialogTitle>Borrow {borrowData?.name}</DialogTitle>
      <TextField
        onChange={handleChange}
        variant="outlined"
        error={error}
        helperText={error ? 'Invalid amount' : ''}
        InputProps={{
          startAdornment: (
            <TokenIcon
              name={borrowData?.name}
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
        <DialogContentText>
          Borrow APY: <span>{borrowData?.borrowAPY}</span>
        </DialogContentText>
      </ContentWrap>
      <Button disabled={error}>
        Borrow {value === undefined ? 0 : value} {borrowData.name}
      </Button>
    </Dialog>
  );
};
