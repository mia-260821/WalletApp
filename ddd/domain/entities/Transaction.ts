import { NetworkType } from '../services/CoinTypePolicy';
import { Address } from '../value-objects/Address';
import { Balance } from '../value-objects/Balance';

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly from: Address,
    public readonly to: Address,
    public readonly amount: Balance,
    public readonly status: 'pending' | 'confirmed' | 'failed',
    public readonly timestamp: number,
    public readonly network: NetworkType,
  ) {}
}
