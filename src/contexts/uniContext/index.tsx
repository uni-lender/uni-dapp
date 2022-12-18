import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import { ethers } from 'ethers';

import { useWeb3Context } from '../web3Context';

import {
  Erc20__factory,
  Erc721Reserve__factory,
  Univ3__factory,
} from '@/contracts';
import {
  ERC721_RESERVE_ADDRESS,
  UNIV3_ADDRESS,
  WETH_ADDRESS,
  WETH_NAME,
} from '@/static/constants/contract';
import { Controller__factory, Erc20Reverse__factory } from '@/contracts';
import {
  CONTROLLER_ADDRESS,
  ERC20_RESERVE_ADDRESS,
} from '@/static/constants/contract';
import { formatWETH } from '@/utils/format';
import { SupplyRow } from '@/pages/home/components/MySupplyTable';
import { UniswapRow } from '@/pages/home/components/UniswapTable';

export type UniContextValue = {
  borrowValue: string;
  getBorrowValue: () => void;
  borrowLimit: string;
  getBorrowLimit: () => void;
  walletBalance: string;
  getWalletBalance: () => void;
  liquidity: string;
  getLiquidity: () => void;
  updateData: () => void;
  supplyRows: SupplyRow[];
  subSupplyRows: UniswapRow[];
  supplyBalance: string;
  erc20SupplyAPY: string;
  erc20BorrowAPY: string;
  uniList: UniswapRow[];
};
const UniContext = createContext({} as UniContextValue);

export const UniContextProvider = ({ children }: { children: ReactNode }) => {
  const { signer, account } = useWeb3Context();
  const [borrowValue, setBorrowValue] = useState('');
  const [borrowLimit, setBorrowLimit] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [liquidity, setLiquidity] = useState('');
  const [supplyRows, setSupplyRows] = useState([] as SupplyRow[]);
  const [subSupplyRows, setSubSupplyRows] = useState([] as UniswapRow[]);
  const [supplyBalance, setSupplyBalance] = useState('');
  const [erc20SupplyAPY, setErc20SupplyAPY] = useState('');
  const [erc20BorrowAPY, setErc20BorrowAPY] = useState('');
  const [uniList, setUniList] = useState([] as UniswapRow[]);

  const getBorrowValue = useCallback(async () => {
    if (!signer || !account) {
      return;
    }
    const erc20Reserve = Erc20Reverse__factory.connect(
      ERC20_RESERVE_ADDRESS,
      signer
    );
    const ret = await erc20Reserve.borrowBalanceOf(account);
    setBorrowValue(formatWETH(ret));
  }, [account, signer]);
  const getBorrowLimit = useCallback(async () => {
    if (!signer || !account) {
      return;
    }
    const controller = Controller__factory.connect(CONTROLLER_ADDRESS, signer);
    const ret = await controller.getAccountLiquidity(account);
    setBorrowLimit(formatWETH(ret));
  }, [account, signer]);

  const getWalletBalance = useCallback(async () => {
    if (!account || !signer) {
      return;
    }
    const wethContract = Erc20__factory.connect(WETH_ADDRESS, signer);
    const walletNumber = await wethContract.balanceOf(account);
    const ret = formatWETH(walletNumber);
    setWalletBalance(ret);
  }, [account, signer]);

  const getLiquidity = useCallback(async () => {
    const erc20 = Erc20__factory.connect(WETH_ADDRESS, signer);
    const balance = await erc20.balanceOf(ERC20_RESERVE_ADDRESS);
    setLiquidity(ethers.utils.formatEther(balance));
  }, [signer]);
  const getSupplied = useCallback(async () => {
    if (!signer || !account) {
      return;
    }
    const erc20Reserve = Erc20Reverse__factory.connect(
      ERC20_RESERVE_ADDRESS,
      signer
    );
    const balance = await erc20Reserve.supplyBalanceOf(account);
    const supplied = formatWETH(balance);
    setSupplyBalance(supplied);
    const ret = [] as SupplyRow[];
    if (Number(supplied) !== 0) {
      ret.push({
        name: WETH_NAME,
        supplied,
        supplyAPY: '1',
      });
    }
    const erc721Reserve = Erc721Reserve__factory.connect(
      ERC721_RESERVE_ADDRESS,
      signer
    );
    const erc721Balance = await erc721Reserve.balanceOf(account);
    const univ3 = Univ3__factory.connect(UNIV3_ADDRESS, signer);
    const subList = [] as UniswapRow[];
    for (let i = 0; i < Math.min(20, erc721Balance.toNumber()); i++) {
      const tokenId = await univ3.tokenOfOwnerByIndex(
        ERC721_RESERVE_ADDRESS,
        i
      );
      const position = await univ3.positions(tokenId);
      const token0 = await Erc20__factory.connect(
        position.token0,
        signer
      ).symbol();
      const token1 = await Erc20__factory.connect(
        position.token1,
        signer
      ).symbol();

      subList.push({
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
    if (subList.length) {
      setSubSupplyRows(subList);
      ret.push({
        name: 'Uniswap',
        supplied: `${subList.length}`,
        supplyAPY: '-',
      });
    }
    setSupplyRows(ret);
  }, [account, signer]);

  const getERC20APY = useCallback(async () => {
    if (!signer || !account) {
      return;
    }
    const erc20Reserve = Erc20Reverse__factory.connect(
      ERC20_RESERVE_ADDRESS,
      signer
    );
    const borrowAPY = await erc20Reserve.borrowAPY();
    const supplyAPY = await erc20Reserve.supplyAPY();
    setErc20BorrowAPY(
      (Number(borrowAPY.toString()) / 1000000000000000000).toString()
    );
    setErc20SupplyAPY(
      (Number(supplyAPY.toString()) / 1000000000000000000).toString()
    );
  }, [account, signer]);
  const getUniList = useCallback(async () => {
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
    setUniList(ret);
  }, [account, signer]);

  const updateData = useCallback(() => {
    getBorrowLimit();
    getBorrowValue();
    getWalletBalance();
    getLiquidity();
    getSupplied();
    getERC20APY();
    getUniList();
  }, [
    getBorrowLimit,
    getBorrowValue,
    getWalletBalance,
    getLiquidity,
    getSupplied,
    getERC20APY,
    getUniList,
  ]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const value = useMemo(() => {
    return {
      borrowLimit,
      borrowValue,
      getBorrowLimit,
      getBorrowValue,
      walletBalance,
      getWalletBalance,
      liquidity,
      getLiquidity,
      updateData,
      supplyRows,
      subSupplyRows,
      supplyBalance,
      erc20BorrowAPY,
      erc20SupplyAPY,
      uniList,
    };
  }, [
    borrowLimit,
    borrowValue,
    getBorrowLimit,
    getBorrowValue,
    getWalletBalance,
    walletBalance,
    getLiquidity,
    liquidity,
    updateData,
    supplyRows,
    subSupplyRows,
    supplyBalance,
    erc20BorrowAPY,
    erc20SupplyAPY,
    uniList,
  ]);
  return <UniContext.Provider value={value}>{children}</UniContext.Provider>;
};
export const useUniContext = () => {
  const data = useContext(UniContext);
  if (Object.keys(data).length === 0) {
    throw new Error(
      'useUniContext() can only be used inside of <UniContext />, please declare it at a higher level'
    );
  }
  return data;
};
