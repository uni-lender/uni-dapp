import ERC20Table from './components/ERC20Table';
import MyBorrowTable from './components/MyBorrowTable';
import UniswapTable from './components/UniswapTable';

export const Home = () => (
  <div>
    <MyBorrowTable />
    <UniswapTable />
    <ERC20Table />
  </div>
);
