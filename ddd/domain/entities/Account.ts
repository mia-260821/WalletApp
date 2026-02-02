import { NetworkType } from '../services/CoinTypePolicy';
import { Address } from '../value-objects/Address';
import { Balance } from '../value-objects/Balance';

// A specific address/balance pairing derived from the wallet's keys.

export interface AccountProps {
  address: Address; // the address is the public identifier used to interact with the blockchain
  balance: Balance;
  derivationPath: string; // e.g., m/44'/60'/0'/0/0
  label?: string;
  network: NetworkType
}

export class Account {
  private props: AccountProps;

  constructor(props: AccountProps) {
    this.props = props;
  }

  // Identity is the core of an Entity
  public get address(): Address {
    return this.props.address;
  }

  public get balance(): Balance {
    return this.props.balance;
  }

  public get label(): string | undefined {
    return this.props.label;
  }

  public get derivationPath(): string {
    return this.props.derivationPath;
  }

  public get network(): NetworkType {
    return this.props.network;
  }

  /**
   * Domain Logic: Update account balance
   * Entities contain the business rules for changing state.
   */
  public updateBalance(newBalance: Balance): void {
    this.props.balance = newBalance;
  }

  /**
   * Domain Logic: Rename the account
   */
  public rename(newLabel: string): void {
    if (newLabel.length > 20) {
      throw new Error("Account label is too long");
    }
    this.props.label = newLabel;
  }
}
