export enum NetworkType {
  BITCOIN = 'BTC',
  ETHEREUM = 'ETH',
  SOLANA = 'SOL'
}

export const getCoinType = (network: NetworkType): number => {
  const map = {
    [NetworkType.BITCOIN]: 0,
    [NetworkType.ETHEREUM]: 60,
    [NetworkType.SOLANA]: 501,
  };
  return map[network];
};
