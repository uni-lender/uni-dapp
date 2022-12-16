import { ethers } from 'ethers';

import { useWeb3Context } from '@/contexts/web3Context';
import { Erc20__factory } from '@/contracts';
import { WETH_ADDRESS } from '@/static/constants/contract';

export const useWalletWETH = () => {
  const { signer, account } = useWeb3Context();
  const getWalletWETH = async () => {
    if (!account || !signer) {
      return;
    }
    const wethContract = Erc20__factory.connect(WETH_ADDRESS, signer);
    const walletNumber = await wethContract.balanceOf(account);
    const ret = Number(ethers.utils.formatEther(walletNumber)).toFixed(2);
    return ret;
  };
  return { getWalletWETH };
};