import { ethers } from 'ethers';

import { Erc20__factory, Univ3__factory } from '../contracts';
import { UNIV3_ADDRESS } from '../static/constants/contract';

console.log('hello univ3');

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545'
  );
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
