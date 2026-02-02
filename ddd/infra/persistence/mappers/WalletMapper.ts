import { Wallet } from '@/ddd/domain/entities/Wallet';
import { Account } from '@/ddd/domain/entities/Account';
import { SeedPhrase } from '@/ddd/domain/value-objects/SeedPhrase';
import { Address } from '@/ddd/domain/value-objects/Address';
import { Balance } from '@/ddd/domain/value-objects/Balance';
import { NetworkType } from '@/ddd/domain/services/CoinTypePolicy';

/**
 * Maps between the Persistence Layer (Plain Objects) and the Domain Layer (Entities)
 */
export class WalletMapper {
  /**
   * Converts a raw JSON object from storage into a rich Domain Entity.
   */
  static toDomain(raw: any, decryptedSeed: string): Wallet {
    // 1. Reconstruct the SeedPhrase Value Object
    const seed = new SeedPhrase(decryptedSeed);
    
    // 2. Instantiate the Wallet Aggregate Root
    const wallet = new Wallet(raw.id, seed);

    // 3. Map the raw account data into Account Entities
    if (raw.accounts && Array.isArray(raw.accounts)) {
      raw.accounts.forEach((acc: any) => {
        const account = new Account({
          address: new Address(acc.address),
          balance: new Balance(acc.balance || 0),
          derivationPath: acc.derivationPath,
          label: acc.label,
          network: acc.network as NetworkType
        });
        
        wallet.addAccount(account);
      });
    }

    return wallet;
  }

  /**
   * Converts a Domain Entity into a plain object for storage.
   * Note: We usually don't include the Seed here because that goes to Keychain.
   */
  static toPersistence(wallet: Wallet): any {
    return {
      id: wallet.id,
      accounts: wallet.getAccounts().map(acc => ({
        address: acc.address,
        balance: acc.balance,
        derivationPath: acc.derivationPath,
        label: acc.label,
        network: acc.network
      }))
    };
  }
}
