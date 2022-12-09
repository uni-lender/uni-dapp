import { ethers } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';

import { Home } from './pages/home';
import { GlobalStyle } from './static/css/globalStyles';
import { Erc20__factory, Univ3__factory } from './contracts';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const Header = styled.header`
  padding: 40px;
  background: #1976d2;
  color: #fff;
  font-weight: bold;
`;
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <Header>header connect wallet</Header>
    <Home />
  </React.StrictMode>
);

console.log('hello univ3');
const UNIV3_ADDRESS = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';
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
