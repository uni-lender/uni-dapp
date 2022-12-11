import { ImgHTMLAttributes } from 'react';
import styled from 'styled-components';

import APE from '@/static/images/tokens/APE.svg';
import DAI from '@/static/images/tokens/DAI.svg';
import LINK from '@/static/images/tokens/LINK.png';
import USDC from '@/static/images/tokens/USDC.svg';
import USDT from '@/static/images/tokens/USDT.svg';
import WBTC from '@/static/images/tokens/WBTC.svg';
import WETH from '@/static/images/tokens/WETH.svg';
const tokenSrcMap = {
  APE,
  DAI,
  LINK,
  USDC,
  USDT,
  WBTC,
  WETH,
};
export type TokenName = keyof typeof tokenSrcMap;
type TokenIconProps = ImgHTMLAttributes<HTMLImageElement> & {
  name: TokenName;
};
const Image = styled.img`
  border-radius: 50%;
`;
export const TokenIcon = ({ name, width, ...otherProps }: TokenIconProps) => {
  return (
    <Image
      src={tokenSrcMap[name]}
      alt={name}
      {...otherProps}
      width={width ?? '40px'}
    />
  );
};
