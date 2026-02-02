import { Address } from "../value-objects/Address";
import { SeedPhrase } from "../value-objects/SeedPhrase";
import { Account } from "./Account";

// aggregate
// The container for all user funds and keys.

export class Wallet { 
    private accounts: Account[] = [];

    constructor(
        public readonly id: string,
        private seedPhrase: SeedPhrase 
    ) {}

    public addAccount(account: Account): void {
        let existed = this.accounts.find(value => value.address === account.address)
        if (existed === undefined) {
            this.accounts.push(account)
        }
    }

    public getAccounts(): ReadonlyArray<Account> {
        return Object.freeze([...this.accounts])
    }

    getSeedPhrase(): SeedPhrase {
        return this.seedPhrase
    }

    public updateAccount(account: Account) {
        const idx = this.accounts.findIndex(item => item.address === account.address)
        if (idx >= 0) 
            this.accounts[idx] = account;
        else
            console.log("upadate account failed: account address not found ", account.address);
    }

    public getAccountByAddress(address: Address): Readonly<Account | undefined> {
        const account = this.accounts.find(item => item.address.getValue().toLowerCase() === address.getValue().toLowerCase());
        if(account) return undefined;
        return account;
    } 

}