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

import { SupplyModal } from '../SupplyModal';

import { TokenIcon, TokenName } from '@/components/tokenIcon';
import { useUniContext } from '@/contexts/uniContext';

const IconWrap = styled(TableCell)`
  display: flex;
  align-items: center;
  img:last-child {
    transform: translateX(-10px);
  }
`;
const StyledTableRow = styled(TableRow)(() => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export type UniswapRow = {
  asset: string;
  token0Symbol: TokenName;
  token1Symbol: TokenName;
  tickLower: number;
  tickUpper: number;
  fee: number;
  value: number;
  supplied: boolean;
  tokenId: string;
};

const UniswapTable = () => {
  const { updateData, uniList } = useUniContext();
  const [supplyOpen, toggleSupplyOpen] = useState(false);
  const [supplyData, setSupplyData] = useState({} as UniswapRow);

  const openSupply = (row: UniswapRow) => {
    setSupplyData(row);
    toggleSupplyOpen(true);
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Typography variant="h6" component="div" sx={{ m: 3 }}>
        UniswapTable
      </Typography>
      <Table sx={{ width: '96%', m: 3 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>Assets</TableCell>
            <TableCell align="right">TickLower</TableCell>
            <TableCell align="right">TickUpper</TableCell>
            <TableCell align="right">Fee</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {uniList.map((row, index) => (
            <StyledTableRow key={index}>
              <IconWrap component="th" scope="row">
                <TokenIcon name={row.token0Symbol} />
                <TokenIcon name={row.token1Symbol} />
                {row.asset}
              </IconWrap>
              <TableCell align="right">{row.tickLower}</TableCell>
              <TableCell align="right">{row.tickUpper}</TableCell>
              <TableCell align="right">{row.fee}</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  style={{ marginRight: '20px' }}
                  size="small"
                  onClick={() => openSupply(row)}
                >
                  Supply
                </Button>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <SupplyModal
        open={supplyOpen}
        supplyData={supplyData}
        onClose={() => {
          toggleSupplyOpen(false);
        }}
        successCallback={() =>
          setTimeout(() => {
            updateData();
          }, 200)
        }
      />
    </TableContainer>
  );
};
export default UniswapTable;
