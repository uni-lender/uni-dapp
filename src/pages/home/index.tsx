import ERC20Table from './components/ERC20Table';
import MyBorrowTable from './components/MyBorrowTable';
import MySupplyTable from './components/MySupplyTable';
import UniswapTable from './components/UniswapTable';

export const Home = () => (
  <div>
    <MySupplyTable />
    <MyBorrowTable />
    <UniswapTable />
    <ERC20Table />
  </div>
);
