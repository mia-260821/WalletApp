import { Wallet } from "../entities/Wallet";


export interface IWalletRepository {
    save(wallet: Wallet): Promise<void>;
    getById(id: string): Promise<Wallet | undefined>;

    getGlobalWallet(): Promise<Wallet | undefined>;
    setGlobalWallet(wallet: Wallet): Promise<void>;
}
