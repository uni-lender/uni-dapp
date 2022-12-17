import { BigNumber, ethers } from 'ethers';

export const truncateTextMid = (text: string, start = 4, end = 4) =>
  text.length > start + end
    ? text.replace(text.substring(start, text.length - end), '...')
    : text;

export const formatWETH = (value: BigNumber, decimal = 2) => {
  return Number(ethers.utils.formatEther(value)).toFixed(decimal);
};
