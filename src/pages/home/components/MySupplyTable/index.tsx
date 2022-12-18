import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Collapse, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';

import { UniswapRow } from '../UniswapTable';
import { WithdrawModal } from '../WithdrawModal';
import { WithdrawERC20Modal } from '../WithdrawERC20Modal';

import { WETH_NAME } from '@/static/constants/contract';
import { TokenIcon } from '@/components/tokenIcon';
import { useUniContext } from '@/contexts/uniContext';

const SubIconWrap = styled(TableCell)`
  display: flex;
  align-items: center;
  img {
    &:last-child {
      transform: translateX(-10px);
    }
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
export type SupplyRow = {
  name: string;
  supplied: string;
  supplyAPY: string;
};
const IconWrap = styled(TableCell)`
  display: flex;
  align-items: center;
  img:last-child {
    transform: translateX(-10px);
  }
`;
const StyledKeyboardArrowUpIcon = styled(KeyboardArrowUpIcon)`
  color: #ffffff !important;
`;
const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)`
  color: #ffffff !important;
`;

const CollapsibleRow = ({
  row,
  subRows,
  openWithdraw,
}: {
  row: SupplyRow;
  subRows: UniswapRow[];
  openWithdraw: (row: UniswapRow) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <StyledKeyboardArrowUpIcon />
            ) : (
              <StyledKeyboardArrowDownIcon />
            )}
          </IconButton>
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="right">{row.supplied}</TableCell>
        <TableCell align="right">{row.supplyAPY}</TableCell>
        <TableCell></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" aria-label="purchases">
              <TableHead>
                <TableRow>
                  <TableCell>Assets</TableCell>
                  <TableCell align="right">TickLower</TableCell>
                  <TableCell align="right">TickUpper</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subRows.map((subRow, index) => (
                  <TableRow key={index}>
                    <SubIconWrap component="th" scope="row">
                      <TokenIcon name={subRow.token0Symbol} />
                      <TokenIcon name={subRow.token1Symbol} />
                      {subRow.asset}
                    </SubIconWrap>
                    <TableCell align="right">{subRow.tickLower}</TableCell>
                    <TableCell align="right">{subRow.tickUpper}</TableCell>
                    <TableCell align="right">{subRow.fee}</TableCell>
                    <TableCell align="right">{subRow.value}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openWithdraw(subRow)}
                      >
                        Withdraw
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
const MySupplyTable = () => {
  const { supplyRows, subSupplyRows, updateData } = useUniContext();
  const [withdrawOpen, toggleWithdrawOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState({} as UniswapRow);
  const openWithdraw = (row: UniswapRow) => {
    setWithdrawData(row);
    toggleWithdrawOpen(true);
  };
  const [erc20WithdrawOpen, toggleOpen] = useState(false);
  const [erc20WithdrawData, setData] = useState({} as SupplyRow);
  const openERC20Withdraw = (row: SupplyRow) => {
    setData(row);
    toggleOpen(true);
  };
  if (!supplyRows.length) {
    return null;
  }
  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Typography variant="h6" component="div" sx={{ m: 3 }}>
        My Supply Assets
      </Typography>
      <Table sx={{ width: '96%', m: 3 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Assets</TableCell>
            <TableCell align="right">Supplied</TableCell>
            <TableCell align="right">Supply APY</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supplyRows.map((row) => {
            if (row.name === WETH_NAME) {
              return (
                <StyledTableRow key={row.name}>
                  <TableCell></TableCell>
                  <IconWrap component="th" scope="row">
                    {row.name === WETH_NAME && <TokenIcon name={WETH_NAME} />}
                    {row.name}
                  </IconWrap>
                  <TableCell align="right">{row.supplied}</TableCell>
                  <TableCell align="right">{row.supplyAPY}</TableCell>
                  <TableCell align="right">
                    {row.name === WETH_NAME && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => openERC20Withdraw(row)}
                      >
                        Withdraw
                      </Button>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            }
            return (
              <CollapsibleRow
                row={row}
                subRows={subSupplyRows}
                openWithdraw={openWithdraw}
              />
            );
          })}
        </TableBody>
      </Table>
      <WithdrawModal
        open={withdrawOpen}
        withdrawData={withdrawData}
        onClose={() => {
          toggleWithdrawOpen(false);
        }}
      />
      <WithdrawERC20Modal
        open={erc20WithdrawOpen}
        withdrawData={erc20WithdrawData}
        onClose={() => {
          toggleOpen(false);
        }}
        successCallback={() =>
          setTimeout(() => {
            updateData();
          }, 300)
        }
      ></WithdrawERC20Modal>
    </TableContainer>
  );
};

export default MySupplyTable;
