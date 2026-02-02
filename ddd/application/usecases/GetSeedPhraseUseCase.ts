import { IWalletRepository } from '../../domain/repositories/IWalletRepository';
import { SeedPhrase } from '../../domain/value-objects/SeedPhrase';

export class GetSeedPhraseUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(walletId: string): Promise<string> {
    // 1. Retrieve the Wallet Aggregate from the Repository
    // The Repository handles the logic of fetching from Secure Keychain
    const wallet = await this.walletRepo.getById(walletId);
    
    if (!wallet) throw new Error("Wallet not found");

    // 2. Return the raw string value of the SeedPhrase Value Object
    return wallet.getSeedPhrase().getValue();
  }
}
