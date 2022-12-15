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

export type SupplyModalProps = {
  open: boolean;
  onClose?: () => void;
  supplyData: UniswapRow;
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
  span {
    color: green;
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
  }
`;
export const SupplyModal = ({
  open,
  onClose,
  supplyData,
}: SupplyModalProps) => {
  const { signer } = useWeb3Context();
  const [imgObj, setImgObj] = useState({} as ImgObj);
  const [checked, isChecked] = useState(false);
  useEffect(() => {
    const getData = async () => {
      if (!supplyData || !Object.keys(supplyData).length) {
        return;
      }
      const univ3Contract = Univ3__factory.connect(UNIV3_ADDRESS, signer);
      const data = await univ3Contract.tokenURI(supplyData.tokenId);
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
  }, [signer, supplyData]);
  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle>Supply Uniswap</StyledDialogTitle>
      {imgObj?.image ? (
        <Image
          src={imgObj.image}
          alt={imgObj.name}
          width="200px"
          onClick={() => isChecked(!checked)}
          className={checked ? 'active' : ''}
          onLoad={() => console.log('onLoad')}
        />
      ) : (
        <LoadingWrap>
          <StyledCircularProgress />
        </LoadingWrap>
      )}

      <StyledDialogContentText>
        Current Borrow Limit: $20 {checked && <span> +$20</span>}
      </StyledDialogContentText>

      <Button disabled={!checked}>Supply nft</Button>
    </Dialog>
  );
};
