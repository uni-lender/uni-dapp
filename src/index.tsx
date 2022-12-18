import React from 'react';
import ReactDOM from 'react-dom/client';
import { Web3ReactProvider } from '@web3-react/core';

import { getLibrary, Web3ContextProvider } from './contexts/web3Context';
import { UniContextProvider } from './contexts/uniContext';

import { Header } from '@/components/header';
import { Home } from '@/pages/home';
import { GlobalStyle } from '@/static/css/globalStyles';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ContextProvider>
        <UniContextProvider>
          <GlobalStyle />
          <Header />
          <Home />
        </UniContextProvider>
      </Web3ContextProvider>
    </Web3ReactProvider>
  </React.StrictMode>
);
