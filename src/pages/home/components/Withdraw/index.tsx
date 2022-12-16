import {
  Button,
  CircularProgress,
  Dialog,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { UniswapRow } from '../UniswapTable';

import { useWeb3Context } from '@/contexts/web3Context';
import { Univ3__factory } from '@/contracts';
import { UNIV3_ADDRESS } from '@/static/constants/contract';

export type WithdrawModalProps = {
  open: boolean;
  onClose?: () => void;
  withdrawData: UniswapRow;
};
type ImgObj = {
  image: string;
  description: string;
  name: string;
};
const StyledDialogTitle = styled(DialogTitle)`
  color: #000;
  text-align: left;
  padding: 0;
`;
const StyledCircularProgress = styled(CircularProgress)`
  color: var(--primary-color) !important;
`;
const Image = styled.img`
  cursor: pointer;
  box-sizing: border-box;
  margin: 20px 100px;
  &.active {
    border: 2px solid var(--primary-color);
    border-radius: 30px;
  }
`;
const LoadingWrap = styled.div`
  width: 400px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StyledDialogContentText = styled(DialogContentText)`
  text-align: left;
  padding: 20px;
  background: #eee;
  margin-bottom: 20px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
  span {
    color: red;
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
  }
`;
export const WithdrawModal = ({
  open,
  onClose,
  withdrawData,
}: WithdrawModalProps) => {
  const { signer } = useWeb3Context();
  const [imgObj, setImgObj] = useState({} as ImgObj);
  const [checked, isChecked] = useState(false);
  useEffect(() => {
    const getData = async () => {
      if (!withdrawData || !Object.keys(withdrawData).length) {
        return;
      }
      const univ3Contract = Univ3__factory.connect(UNIV3_ADDRESS, signer);
      const data = await univ3Contract.tokenURI(withdrawData.tokenId);
      const retObj = JSON.parse(
        atob(data.replace(/^data:\w+\/\w+;base64,/, ''))
      );
      setTimeout(() => {
        setImgObj(retObj as ImgObj);
      }, 2000);
    };
    getData();
    return () => {
      setImgObj({} as ImgObj);
    };
  }, [signer, withdrawData]);
  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle>Withdraw Uniswap</StyledDialogTitle>
      {imgObj?.image ? (
        <Image
          src={imgObj.image}
          alt={imgObj.name}
          width="200px"
          onClick={() => isChecked(!checked)}
          className={checked ? 'active' : ''}
        />
      ) : (
        <LoadingWrap>
          <StyledCircularProgress />
        </LoadingWrap>
      )}

      <StyledDialogContentText>
        Current Borrow Limit: $20 {checked && <span> -$20</span>}
      </StyledDialogContentText>

      <Button disabled={!checked}>Withdraw nft</Button>
    </Dialog>
  );
};
