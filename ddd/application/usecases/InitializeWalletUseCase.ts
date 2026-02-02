import { Wallet } from "@/ddd/domain/entities/Wallet";
import { WalletFactory } from "@/ddd/domain/factories/WalletFactory";
import { IWalletRepository } from "@/ddd/domain/repositories/IWalletRepository";
import { IKeyDerivationService } from "@/ddd/domain/services/IKeyDerivationService";

export class InitializeWalletUseCase {
  constructor(
    private walletRepo: IWalletRepository,
    private keyService: IKeyDerivationService
  ) {}

  async execute(): Promise<Wallet> {
    // 1. Check if a wallet already exists
    const existing = await this.walletRepo.getGlobalWallet();
    console.log("global wallet", existing, "seed", existing?.getSeedPhrase().getValue());
    if (existing) return existing;

    // 2. Generate the new Wallet Aggregate
    const newWallet = WalletFactory.createNew();

    // // 3. Create the first default Ethereum account (index 0)
    // const path = "m/44'/60'/0'/0/0";
    // const address = await this.keyService.deriveAddress(newWallet.getSeedPhrase(), path);
    
    // newWallet.addAccount(new Account({
    //   address: new Address(address),
    //   label: "Main Account",
    //   derivationPath: path,
    //   balance: new Balance(0)
    // }));

    // 4. Persist to Secure Storage & Database via Repository
    await this.walletRepo.save(newWallet);

    this.walletRepo.setGlobalWallet(newWallet);

    return newWallet;
  }
}
