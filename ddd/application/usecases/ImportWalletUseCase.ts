import { Account } from "@/ddd/domain/entities/Account";
import { Wallet } from "@/ddd/domain/entities/Wallet";
import { generateId } from "@/ddd/domain/factories/WalletFactory";
import { IWalletRepository } from "@/ddd/domain/repositories/IWalletRepository";
import { IKeyDerivationService } from "@/ddd/domain/services/IKeyDerivationService";
import { Address } from "@/ddd/domain/value-objects/Address";
import { Balance } from "@/ddd/domain/value-objects/Balance";
import { SeedPhrase } from "@/ddd/domain/value-objects/SeedPhrase";


export class ImportWalletUseCase {
  constructor(
    private walletRepo: IWalletRepository,
    private keyService: IKeyDerivationService
  ) {}

  async execute(mnemonic: string): Promise<Wallet> {
    console.log("hi", mnemonic);
    // 1. Create the SeedPhrase (will throw error if invalid)
    const seed = new SeedPhrase(mnemonic);
    
    // 2. Build the Wallet Aggregate
    const importedWallet = new Wallet(generateId(), seed);

    // 3. Re-derive the first account (m/44'/60'/0'/0/0)
    // const path = "m/44'/60'/0'/0/0";
    // const address = await this.keyService.deriveAddress(seed, path);
    
    // importedWallet.addAccount(new Account({
    //   address: new Address(address),
    //   label: "Imported Account",
    //   derivationPath: path,
    //   balance: new Balance(0)
    // }));

    // 4. Save to Infrastructure (Keychain + AsyncStorage)
    await this.walletRepo.save(importedWallet);
    return importedWallet;
  }
}
