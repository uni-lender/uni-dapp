import { ethers } from 'ethers';

import { Univ3__factory } from './contracts';

const UNIV3_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

(async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545'
  );
  const signer = provider.getSigner(0);
  const blockNumber = await provider.getBlockNumber();
  console.log(blockNumber);
  const univ3 = new Univ3__factory.connect(UNIV3_ADDRESS, signer);

  const position = univ3.position(27455);
  console.log(position);
})();
