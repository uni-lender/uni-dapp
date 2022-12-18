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

import { Erc20__factory } from '@/contracts';
import { WETH_ADDRESS } from '@/static/constants/contract';
import { Controller__factory, Erc20Reverse__factory } from '@/contracts';
import {
  CONTROLLER_ADDRESS,
  ERC20_RESERVE_ADDRESS,
} from '@/static/constants/contract';
import { formatWETH } from '@/utils/format';

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
};
const UniContext = createContext({} as UniContextValue);

export const UniContextProvider = ({ children }: { children: ReactNode }) => {
  const { signer, account } = useWeb3Context();
  const [borrowValue, setBorrowValue] = useState('');
  const [borrowLimit, setBorrowLimit] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [liquidity, setLiquidity] = useState('');

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
  const updateData = useCallback(() => {
    getBorrowLimit();
    getBorrowValue();
    getWalletBalance();
    getLiquidity();
  }, [getBorrowLimit, getBorrowValue, getWalletBalance, getLiquidity]);

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
