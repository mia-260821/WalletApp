import { Address } from '../value-objects/Address';
import { Balance } from '../value-objects/Balance';
import { NetworkType } from './CoinTypePolicy';

export interface IBalanceService {
  fetchRemoteBalance(address: Address, network: NetworkType): Promise<Balance>;
}
