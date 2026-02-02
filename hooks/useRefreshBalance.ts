import { RefreshWalletBalancesUseCase } from '@/ddd/application/usecases/RefreshWalletBalancesUseCase';
import { RestBalanceService } from '@/ddd/infra/services/RestBalanceService';
import { RepositoryFactory } from '@/ddd/infra/factory/RepositoryFactory';
import { useState } from 'react';
import { useWalletStore } from '@/store/useWalletStore';


export const useBalanceRefresh = (walletId: string) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateBalances = useWalletStore((state) => state.updateBalances);

  const refresh = async () => {
    if (!walletId) return;

    setIsRefreshing(true);
    try {
      const repo = RepositoryFactory.createWalletRepository();
      const api = new RestBalanceService();
      const refreshUseCase = new RefreshWalletBalancesUseCase(repo, api);

      const updatedAccounts = await refreshUseCase.execute(walletId);

      updateBalances(updatedAccounts.map(item => (
        {address: item.address.getValue(), balance: item.balance.getAmount()}
      )));
      
      console.log("Balances updated successfully from Go backend");
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return { refresh, isRefreshing };
};
