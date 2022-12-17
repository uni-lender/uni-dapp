import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';

import { BorrowRow } from '../MyBorrowTable';
import { BorrowModal } from '../BorrowERC20Modal';
import { SupplyERC20Modal } from '../SupplyERC20Modal';

import { TokenIcon, TokenName } from '@/components/tokenIcon';
import { useWalletWETH } from '@/hooks/useWalletWETH';

const IconWrap = styled(TableCell)`
  display: flex;
  align-items: center;
  img {
    margin-right: 10px;
  }
`;

const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const createData = (
  name: TokenName,
  balance: number,
  tvl: number,
  supplyAPY: number,
  borrowAPY: number,
  liquidity: number
) => {
  return { name, balance, supplyAPY, borrowAPY, liquidity, tvl };
};

const rows = [createData('WETH', 1, 159, 6.0, 243, 4.0)];

const ERC20Table = () => {
  const { getWalletWETH } = useWalletWETH();
  const [walletBalance, setWalletBalance] = useState('');
  const getBalance = useCallback(async () => {
    const ret = await getWalletWETH();
    setWalletBalance(ret ?? '');
  }, [getWalletWETH]);
  useEffect(() => {
    getBalance();
  }, [getBalance]);
  const [borrowOpen, toggleBorrowOpen] = useState(false);
  const [borrowData, setBorrowData] = useState({} as BorrowRow);
  const openBorrow = (row: BorrowRow) => {
    toggleBorrowOpen(true);
    setBorrowData(row);
  };
  const [supplyOpen, toggleSupplyOpen] = useState(false);
  const [supplyData, setSupplyData] = useState({} as BorrowRow);
  const openSupply = (row: BorrowRow) => {
    toggleSupplyOpen(true);
    setSupplyData(row);
  };
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ m: 3 }}>
        ERC20 Tokens
      </Typography>
      <Table sx={{ width: '96%', m: 3 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>Assets</TableCell>
            <TableCell align="right">Wallet Balance</TableCell>
            <TableCell align="right">TVL</TableCell>
            <TableCell align="right">Supply APY</TableCell>
            <TableCell align="right">Borrow APY</TableCell>
            <TableCell align="right">Liquidity</TableCell>
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
              <TableCell align="right">{walletBalance}WETH</TableCell>
              <TableCell align="right">{row.tvl}</TableCell>
              <TableCell align="right">{row.supplyAPY}</TableCell>
              <TableCell align="right">{row.borrowAPY}</TableCell>
              <TableCell align="right">{row.liquidity}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openSupply(row)}
                  style={{
                    marginRight: '20px',
                  }}
                >
                  Supply
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openBorrow(row)}
                >
                  Borrow
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
      ></BorrowModal>
      <SupplyERC20Modal
        open={supplyOpen}
        supplyData={supplyData}
        onClose={() => {
          toggleSupplyOpen(false);
          setSupplyData({} as BorrowRow);
        }}
        successCallback={() => setTimeout(() => getBalance(), 300)}
      />
    </TableContainer>
  );
};
export default ERC20Table;
