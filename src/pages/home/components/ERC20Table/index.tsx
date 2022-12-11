import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';

import { TokenIcon, TokenName } from '@/components/tokenIcon';

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
  supplyAPY: number,
  borrowAPY: number,
  Liquidity: number
) => {
  return { name, balance, supplyAPY, borrowAPY, Liquidity };
};

const rows = [createData('WETH', 159, 6.0, 24, 4.0)];

const ERC20Table = () => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" component="div" sx={{ m: 3 }}>
        ERC20 Tokens
      </Typography>
      <Table sx={{ width: '96%', m: 3 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>Assets</TableCell>
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
              <TableCell align="right">{row.balance}</TableCell>
              <TableCell align="right">{row.supplyAPY}</TableCell>
              <TableCell align="right">{row.borrowAPY}</TableCell>
              <TableCell align="right">{row.Liquidity}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small">
                  Borrow
                </Button>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ERC20Table;
