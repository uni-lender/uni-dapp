import { ethers } from 'ethers';

import { RPC_HOST, UNIV3_ADDRESS } from '@/static/constants/contract';
import { Erc20__factory, Univ3__factory } from '@/contracts';

console.log('hello univ3');

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(RPC_HOST);
  const signer = provider.getSigner(0);
  const blockNumber = await provider.getBlockNumber();
  console.log('blockNumber:', blockNumber);
  const univ3 = Univ3__factory.connect(UNIV3_ADDRESS, signer);

  const position = await univ3.positions(27455);
  console.log('token 27455 position:', JSON.stringify(position));

  const token0 = await Erc20__factory.connect(position.token0, signer).symbol();
  const token1 = await Erc20__factory.connect(position.token1, signer).symbol();
  console.log(token0, token1);
})();
