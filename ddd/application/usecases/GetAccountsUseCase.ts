import { IWalletRepository } from '../../domain/repositories/IWalletRepository';
import { Account } from '../../domain/entities/Account';

export class GetAccountsUseCase {
  constructor(private walletRepo: IWalletRepository) {}

  async execute(walletId: string): Promise<Account[]> {
    const wallet = await this.walletRepo.getById(walletId);
    return wallet ? [...wallet.getAccounts()] : [];
  }
}
