import { IWalletRepository } from '../../domain/repositories/IWalletRepository';
import { IKeyDerivationService } from '../../domain/services/IKeyDerivationService';
import { Account } from '../../domain/entities/Account';
import { Address } from '../../domain/value-objects/Address';
import { Balance } from '../../domain/value-objects/Balance';
import { NetworkType, getCoinType } from '../../domain/services/CoinTypePolicy';

export class CreateAccountUseCase {
  /**
   * We inject interfaces (abstractions) rather than concrete classes.
   * This makes the code testable and decoupled.
   */
  constructor(
    private walletRepo: IWalletRepository,
    private keyService: IKeyDerivationService
  ) {}

  /**
   * The orchestration logic for creating an account.
   */
  async execute(walletId: string, label: string, network: NetworkType): Promise<Account> {
    // 1. Fetch the Wallet Aggregate from the Infrastructure Layer
    const wallet = await this.walletRepo.getById(walletId);
    if (!wallet) {
      throw new Error(`Wallet with ID ${walletId} not found.`);
    }

    // 2. Determine the next index for this specific network
    // Business Rule: Accounts are derived incrementally to avoid address collisions
    const existingAccounts = wallet.getAccounts().filter(acc => acc.network === network);
    const nextIndex = existingAccounts.length;

    // 3. Define the Derivation Path based on BIP-44 standards
    const coinType = getCoinType(network);
    const path = `m/44'/${coinType}'/0'/0/${nextIndex}`;

    // 4. Use Domain Service to derive the Public Address
    // Note: The Seed Phrase is retrieved safely from the Wallet Entity
    const addressString = await this.keyService.deriveAddress(
      wallet.getSeedPhrase(), 
      path
    );

    // 5. Create the new Account Entity
    const newAccount = new Account({
      address: new Address(addressString),
      balance: new Balance(0), // Initial state
      derivationPath: path,
      label: label,
      network: network
    });

    // 6. Update the Aggregate Root
    // The Wallet entity will validate if this account can be added
    wallet.addAccount(newAccount);

    // 7. Persist the updated Wallet (and its new Account) via the Repository
    await this.walletRepo.save(wallet);

    return newAccount;
  }
}
