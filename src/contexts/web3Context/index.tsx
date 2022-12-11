import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';

import univ3Abi from '@/abi/univ3.json';
import {
  LAST_CONNECTED_LOCAL_SESSION_NAME,
  WALLET_TYPE,
} from '@/static/constants/wallet';

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
  ],
});
export const getLibrary = (provider: any) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return getLibrary;
};
export type Web3ContextValue = {
  active: boolean;
  account: string;
  connectWallet: () => void;
  disconnectWallet: () => void;
};
const Web3Context = React.createContext({} as Web3ContextValue);
export const Web3ContextProvider = ({ children }: { children: ReactNode }) => {
  const { active, account, activate, deactivate } = useWeb3React();

  const connectWallet = useCallback(async () => {
    try {
      await activate(injectedConnector);
      localStorage.setItem(LAST_CONNECTED_LOCAL_SESSION_NAME, WALLET_TYPE);
    } catch (err) {
      console.error('connect wallet error');
      console.error(err);
      throw err;
    }
  }, [activate]);
  const disconnectWallet = useCallback(async () => {
    try {
      await deactivate();
      localStorage.removeItem(LAST_CONNECTED_LOCAL_SESSION_NAME);
    } catch (err) {
      console.error('disconnect wallet error');
      console.error(err);
      throw err;
    }
  }, [deactivate]);
  const callFunction = useCallback(async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const constractAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
    const univ3Contract = new ethers.Contract(
      constractAddress,
      univ3Abi,
      provider
    );
    const ret = await univ3Contract.positions(27455);
    console.log('ret', ret.token0);
  }, []);
  useEffect(() => {
    const init = async () => {
      const lastConnected = localStorage.getItem(
        LAST_CONNECTED_LOCAL_SESSION_NAME
      );
      if (lastConnected) {
        try {
          await connectWallet();
          console.log('eagerly connect success');
          return;
        } catch (e) {
          console.warn('eagerly connect failed');
        }
      }
    };
    init();
  }, [connectWallet]);
  const value = useMemo(() => {
    return {
      active,
      account: account || '',
      connectWallet,
      disconnectWallet,
      callFunction,
    };
  }, [account, active, connectWallet, disconnectWallet, callFunction]);

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => {
  const data = useContext(Web3Context);
  if (Object.keys(data).length === 0) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3Context />, please declare it at a higher level'
    );
  }
  return data;
};
