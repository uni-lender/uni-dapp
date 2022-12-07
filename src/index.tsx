import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';

import { Home } from './pages/home';
import { GlobalStyle } from './static/css/globalStyles';

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
