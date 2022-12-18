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

import { BorrowModal } from '../BorrowERC20Modal';
import { RepayModal } from '../RepayERC20Modal';

import { TokenIcon, TokenName } from '@/components/tokenIcon';
import { useUniContext } from '@/contexts/uniContext';

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
  const { borrowValue, getBorrowValue, getBorrowLimit } = useUniContext();
  const [borrowOpen, toggleBorrowOpen] = useState(false);
  const [borrowData, setBorrowData] = useState({} as BorrowRow);
  const openBorrow = (row: BorrowRow) => {
    toggleBorrowOpen(true);
    setBorrowData(row);
  };
  const [repayOpen, toggleRelayOpen] = useState(false);
  const [repayData, setRepayData] = useState({} as BorrowRow);
  const openRepay = (row: BorrowRow) => {
    toggleRelayOpen(true);
    setRepayData(row);
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Typography variant="h6" component="div" sx={{ m: 3 }}>
        My Borrow Assets
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
              <TableCell align="right">{borrowValue}</TableCell>
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
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openRepay(row)}
                >
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
        successCallback={() =>
          setTimeout(() => {
            getBorrowValue();
            getBorrowLimit();
          }, 200)
        }
      />
      <RepayModal
        open={repayOpen}
        repayData={repayData}
        onClose={() => {
          toggleRelayOpen(false);
          setRepayData({} as BorrowRow);
        }}
        successCallback={() =>
          setTimeout(() => {
            getBorrowValue();
            getBorrowLimit();
          }, 200)
        }
      ></RepayModal>
    </TableContainer>
  );
};

export default MyBorrowTable;
