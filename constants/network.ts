import { NetworkType } from "@/ddd/domain/services/CoinTypePolicy";

export const NETWORKS = [
  { id: NetworkType.ETHEREUM, name: 'Ethereum', icon: '⟠', color: '#627EEA' },
  { id: NetworkType.BITCOIN, name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { id: NetworkType.SOLANA, name: 'Solana', icon: '◎', color: '#14F195' },
];
