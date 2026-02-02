import { Wallet } from "@/ddd/domain/entities/Wallet";
import { IWalletRepository } from "@/ddd/domain/repositories/IWalletRepository";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SeedPhrase } from "@/ddd/domain/value-objects/SeedPhrase";
import { Account } from "@/ddd/domain/entities/Account";
import { Address } from "@/ddd/domain/value-objects/Address";
import { Balance } from "@/ddd/domain/value-objects/Balance";


export class SimpleWalletRepository implements IWalletRepository {
    private readonly WALLET_KEY_PREFIX = '@wallet_metadata_';
    private readonly WALLET_ID_KEY = '@wallet_id'

    constructor(){
        console.log("Web Wallet Repository");
    }

    async getGlobalWallet(): Promise<Wallet | undefined> {
        const wallet_id = await AsyncStorage.getItem(this.WALLET_ID_KEY)
        if (!wallet_id) return undefined;
        return this.getById(wallet_id);
    }

    async setGlobalWallet(wallet: Wallet): Promise<void> {
        await AsyncStorage.setItem(this.WALLET_ID_KEY, wallet.id);
    }

    async save(wallet: Wallet): Promise<void> {
        const metadata = {
            id: wallet.id,
            accounts: wallet.getAccounts().map(acc => ({
                address: acc.address.getValue(),
                derivationPath: acc.derivationPath, // We save this so we know how to re-derive the key!
                label: acc.label,
                network: acc.network,
            })),
            seedPhrase: wallet.getSeedPhrase().getValue(),
        };
        await AsyncStorage.setItem(
            `${this.WALLET_KEY_PREFIX}${wallet.id}`,
            JSON.stringify(metadata)
        );
    }

    async getById(id: string): Promise<Wallet | undefined> {
        const data = await AsyncStorage.getItem(`${this.WALLET_KEY_PREFIX}${id}`);
        if (!data) return undefined;
        const metadata = JSON.parse(data);

        const wallet = new Wallet(id, new SeedPhrase(metadata.seedPhrase));
        
        metadata.accounts.forEach((acc: any) => {
            const account = new Account({
                address: new Address(acc.address),
                derivationPath: acc.derivationPath,
                label: acc.label,
                network: acc.network,
                balance: new Balance(0) // Balance is usually fetched fresh from an API, not DB
            });
            wallet.addAccount(account);
        });

        return wallet;
    }
}