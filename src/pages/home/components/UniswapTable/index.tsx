import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { SupplyModal } from '../SupplyModal';
import { WithdrawModal } from '../Withdraw';

import { UNIV3_ADDRESS } from '@/static/constants/contract';
import { Erc20__factory, Univ3__factory } from '@/contracts';
import { useWeb3Context } from '@/contexts/web3Context';
import { TokenIcon, TokenName } from '@/components/tokenIcon';

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
  const { signer, account } = useWeb3Context();
  const [list, setList] = useState([] as Array<UniswapRow>);
  const [supplyOpen, toggleSupplyOpen] = useState(false);
  const [supplyData, setSupplyData] = useState({} as UniswapRow);
  const [withdrawOpen, toggleWithdrawOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState({} as UniswapRow);

  const getTableData = useCallback(async () => {
    if (!account || !signer) {
      return;
    }
    const univ3 = Univ3__factory.connect(UNIV3_ADDRESS, signer);
    const balance = await univ3.balanceOf(account);
    const ret = [];
    for (let i = 0; i < Math.min(20, balance.toNumber()); i++) {
      const tokenId = await univ3.tokenOfOwnerByIndex(account, i);
      const position = await univ3.positions(tokenId);
      const token0 = await Erc20__factory.connect(
        position.token0,
        signer
      ).symbol();
      const token1 = await Erc20__factory.connect(
        position.token1,
        signer
      ).symbol();
      ret.push({
        asset: `LP-${token0} / ${token1}`,
        token0Symbol: token0,
        token1Symbol: token1,
        fee: position.fee,
        tickLower: position.tickLower,
        tickUpper: position.tickUpper,
        value: 1,
        tokenId: tokenId.toString(),
      } as UniswapRow);
    }
    setList(ret);
  }, [account, signer]);
  const openSupply = (row: UniswapRow) => {
    setSupplyData(row);
    toggleSupplyOpen(true);
  };
  const openWithdraw = (row: UniswapRow) => {
    setWithdrawData(row);
    toggleWithdrawOpen(true);
  };
  useEffect(() => {
    getTableData();
  }, [getTableData]);
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
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Suplied</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row, index) => (
            <StyledTableRow key={index}>
              <IconWrap component="th" scope="row">
                <TokenIcon name={row.token0Symbol} />
                <TokenIcon name={row.token1Symbol} />
                {row.asset}
              </IconWrap>
              <TableCell align="right">{row.tickLower}</TableCell>
              <TableCell align="right">{row.tickUpper}</TableCell>
              <TableCell align="right">{row.fee}</TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">true</TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  style={{ marginRight: '20px' }}
                  size="small"
                  onClick={() => openSupply(row)}
                >
                  Supply
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => openWithdraw(row)}
                >
                  Withdraw
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
      />
      <WithdrawModal
        open={withdrawOpen}
        withdrawData={withdrawData}
        onClose={() => {
          toggleWithdrawOpen(false);
        }}
      />
    </TableContainer>
  );
};
export default UniswapTable;
