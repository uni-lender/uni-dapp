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
import { StyledCircularProgress } from '../SupplyERC20Modal';

import { useWeb3Context } from '@/contexts/web3Context';
import { Erc721Reserve__factory, Univ3__factory } from '@/contracts';
import {
  ERC721_RESERVE_ADDRESS,
  UNIV3_ADDRESS,
} from '@/static/constants/contract';
import { SuccessToast } from '@/components/successToast';
import { useUniContext } from '@/contexts/uniContext';

export type WithdrawModalProps = {
  open: boolean;
  onClose?: () => void;
  withdrawData: UniswapRow;
  successCallback?: () => void;
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
const ImageCircularProgress = styled(CircularProgress)`
  color: var(--primary-color) !important;
`;
const Image = styled.img`
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
  successCallback,
}: WithdrawModalProps) => {
  const { signer } = useWeb3Context();
  const { borrowLimit } = useUniContext();
  const [imgObj, setImgObj] = useState({} as ImgObj);
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
      setImgObj(retObj as ImgObj);
    };
    getData();
    return () => {
      setImgObj({} as ImgObj);
    };
  }, [signer, withdrawData]);
  const handleClose = () => {
    toggleLoading(false);
    onClose && onClose();
  };
  const [loading, toggleLoading] = useState(false);
  const [toastOpen, toggleToastOpen] = useState(false);
  const withdrawNFT = async () => {
    try {
      toggleLoading(true);
      const erc721Reserve = Erc721Reserve__factory.connect(
        ERC721_RESERVE_ADDRESS,
        signer
      );

      const withdrawTx = await erc721Reserve.withdraw(withdrawData?.tokenId);
      withdrawTx.wait();

      successCallback && successCallback();
      toggleToastOpen(true);
      toggleLoading(false);
      handleClose();
    } catch (e) {
      console.log(e);
      toggleLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <StyledDialogTitle>Withdraw Uniswap</StyledDialogTitle>
        {imgObj?.image ? (
          <Image
            src={imgObj.image}
            alt={imgObj.name}
            width="200px"
            className={'active'}
          />
        ) : (
          <LoadingWrap>
            <ImageCircularProgress />
          </LoadingWrap>
        )}

        <StyledDialogContentText>
          Borrow Limit: {borrowLimit}WETH{' '}
          <span style={{ color: 'green' }}> -1WETH</span>
        </StyledDialogContentText>

        <Button disabled={loading} onClick={withdrawNFT}>
          Withdraw nft
          {loading && <StyledCircularProgress size={20} />}
        </Button>
      </Dialog>
      <SuccessToast open={toastOpen} onClose={() => toggleToastOpen(false)} />
    </>
  );
};
