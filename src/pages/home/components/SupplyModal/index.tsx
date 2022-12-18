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
import {
  Controller__factory,
  Erc721Reserve__factory,
  Univ3__factory,
} from '@/contracts';
import {
  CONTROLLER_ADDRESS,
  ERC721_RESERVE_ADDRESS,
  UNIV3_ADDRESS,
} from '@/static/constants/contract';
import { SuccessToast } from '@/components/successToast';
import { formatWETH } from '@/utils/format';

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
  const { signer, account } = useWeb3Context();
  const [imgObj, setImgObj] = useState({} as ImgObj);
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
      setImgObj(retObj as ImgObj);
    };
    getData();
    return () => {
      setImgObj({} as ImgObj);
    };
  }, [signer, supplyData]);
  const [borrowLimit, setBorrowLimit] = useState('');
  useEffect(() => {
    const getBorrowLimit = async () => {
      if (!signer || !account) {
        return;
      }
      const controller = Controller__factory.connect(
        CONTROLLER_ADDRESS,
        signer
      );
      const ret = await controller.getAccountLiquidity(account);
      setBorrowLimit(formatWETH(ret));
    };
    getBorrowLimit();
  }, [account, signer]);
  const handleClose = () => {
    toggleLoading(false);
    onClose && onClose();
  };
  const [loading, toggleLoading] = useState(false);
  const [toastOpen, toggleToastOpen] = useState(false);
  const supplyNFT = async () => {
    try {
      toggleLoading(true);

      const erc721Reserve = Erc721Reserve__factory.connect(
        ERC721_RESERVE_ADDRESS,
        signer
      );
      const univ3 = Univ3__factory.connect(UNIV3_ADDRESS, signer);

      const tx = await univ3.approve(
        ERC721_RESERVE_ADDRESS,
        supplyData?.tokenId
      );
      await tx.wait();

      const supplyTx = await erc721Reserve.supply(supplyData?.tokenId);
      supplyTx.wait();

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
      <Dialog open={open} onClose={handleClose}>
        <StyledDialogTitle>Supply Uniswap</StyledDialogTitle>
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
          <span style={{ color: 'green' }}> +1WETH</span>
        </StyledDialogContentText>

        <Button
          onClick={supplyNFT}
          disabled={loading || imgObj?.image === undefined}
        >
          Supply nft
          {loading && <StyledCircularProgress size={20} />}
        </Button>
      </Dialog>
      <SuccessToast open={toastOpen} onClose={() => toggleToastOpen(false)} />
    </>
  );
};
