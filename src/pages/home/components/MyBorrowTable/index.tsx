import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import { useState } from 'react';

import { BorrowModal } from '../BorrowModal';

import { TokenIcon, TokenName } from '@/components/tokenIcon';

const IconWrap = styled(TableCell)`
  display: flex;
  align-items: center;
  img {
    margin-right: 10px;
  }
`;

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export type BorrowRow = {
  name: TokenName;
  balance: number;
  supplyAPY: number;
  borrowAPY: number;
  liquidity: number;
  tvl?: number;
};
const createData = (
  name: TokenName,
  balance: number,
  supplyAPY: number,
  borrowAPY: number,
  liquidity: number
) => {
  return { name, balance, supplyAPY, borrowAPY, liquidity } as BorrowRow;
};

const rows = [createData('WETH', 159, 6.0, 24, 4.0)];

const MyBorrowTable = () => {
  const [borrowOpen, toggleBorrowOpen] = useState(false);
  const [borrowData, setBorrowData] = useState({} as BorrowRow);
  const openBorrow = (row: BorrowRow) => {
    toggleBorrowOpen(true);
    setBorrowData(row);
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Typography variant="h6" component="div" sx={{ m: 3 }}>
        My Borrow Table
      </Typography>
      <Table sx={{ width: '96%', m: 3 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>Assets</TableCell>
            <TableCell align="right">Borrowed Amount</TableCell>
            <TableCell align="right">Borrow APY</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <IconWrap component="th" scope="row">
                <TokenIcon name={row.name} />
                {row.name}
              </IconWrap>
              <TableCell align="right">{row.balance}</TableCell>
              <TableCell align="right">{row.borrowAPY}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  style={{ marginRight: '20px' }}
                  size="small"
                  onClick={() => openBorrow(row)}
                >
                  Borrow More
                </Button>{' '}
                <Button variant="outlined" size="small">
                  Repay
                </Button>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <BorrowModal
        open={borrowOpen}
        borrowData={borrowData}
        onClose={() => {
          toggleBorrowOpen(false);
          setBorrowData({} as BorrowRow);
        }}
      />
    </TableContainer>
  );
};

export default MyBorrowTable;
