import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'transparent',
      color: theme.palette.grey[700],
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor: 'white',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  name: string,
  balance: number,
  supplyAPY: number,
  borrowAPY: number,
  Liquidity: number,
) {
  return { name, balance, supplyAPY, borrowAPY, Liquidity };
}

const rows = [
  createData('ETH', 159, 6.0, 24, 4.0),
];

export default function ERC20Table() {
  return (
    <TableContainer component={Paper}>
      <Typography variant='h6' component="div" sx={{m: 3}}>ERC20 Tokens</Typography>
      <Table sx={{ width: '96%', m: 3 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Assets</StyledTableCell>
            <StyledTableCell align="right">TVL</StyledTableCell>
            <StyledTableCell align="right">Supply APY</StyledTableCell>
            <StyledTableCell align="right">Borrow APY</StyledTableCell>
            <StyledTableCell align="right">Liquidity</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.balance}</StyledTableCell>
              <StyledTableCell align="right">{row.supplyAPY}</StyledTableCell>
              <StyledTableCell align="right">{row.borrowAPY}</StyledTableCell>
              <StyledTableCell align="right">{row.Liquidity}</StyledTableCell>
              <StyledTableCell align="right"><Button variant="outlined">Borrow</Button></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}