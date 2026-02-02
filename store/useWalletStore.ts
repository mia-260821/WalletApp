import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 

interface AccountBalance {address: string, balance: number}

interface WalletState {
    walletId: string | null;
    balances: AccountBalance[];

    updateWalletId: (walletId: string) => void;
    updateBalances: (balances: AccountBalance[]) => void;
    reset: () => void;
}

export const useWalletStore = create<WalletState>()(
    persist(
        (set) => ({
            // State
            walletId: null,
            balances: [],
            // Actions
            updateWalletId: (walletId: string) => set({ walletId: walletId, balances: [] }),
            updateBalances: (balances: AccountBalance[]) => set({ balances: balances }),
            reset: () => set({ walletId: null, balances: []}),
        }),
        {
            name: 'wallet-session', 
        }
    )
);

