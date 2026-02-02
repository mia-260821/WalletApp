import { Account } from "@/ddd/domain/entities/Account";
import { IWalletRepository } from "@/ddd/domain/repositories/IWalletRepository";
import { IBalanceService } from "@/ddd/domain/services/IBalanceService";
import { Address } from "@/ddd/domain/value-objects/Address";
import { Balance } from "@/ddd/domain/value-objects/Balance";
import { Wallet } from "ethers";


export class RefreshWalletBalancesUseCase {
  constructor(
    private walletRepo: IWalletRepository,
    private balanceService: IBalanceService
  ) {}

  async execute(walletId: string): Promise<Account[]> {
    const wallet = await this.walletRepo.getById(walletId);
    if (!wallet) return [];

    // Orchestrate: Fetch new balances for all accounts in the wallet

    const updatedAccounts = []

    for(const account of wallet.getAccounts()){
      const newBalance = await this.balanceService.fetchRemoteBalance(
        account.address, 
        account.network
      );
      account.updateBalance(newBalance);
      updatedAccounts.push(account);
    }

    return updatedAccounts;
  }
}
