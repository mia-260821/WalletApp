import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { NetworkType } from "../../domain/services/CoinTypePolicy";
import { IBlockchainService } from "../../domain/services/IBlockchainService";
import { IKeyDerivationService } from "../../domain/services/IKeyDerivationService";
import { Address } from "../../domain/value-objects/Address";

export class SendFundsUseCase {
  
  constructor(
    private walletRepo: IWalletRepository,
    private blockchainService: IBlockchainService,
    private keyService: IKeyDerivationService // Needed to sign the TX
  ) {}

  async execute(
    walletId: string, 
    fromAddress: Address, // We need to know which account is sending
    toAddress: Address, 
    amount: number,
    network: NetworkType   // We MUST know the chain
  ): Promise<void> {

    console.log('******', walletId, toAddress, amount, network);
    
    // 1. Fetch the Wallet Aggregate
    const wallet = await this.walletRepo.getById(walletId);
    if (!wallet) throw new Error("Wallet not found");

    // 2. Find the specific Account Entity within the Wallet
    const account = wallet.getAccountByAddress(fromAddress);
    if (!account) throw new Error("Source account not found");

    // 3. SECURE STEP: Derive the Private Key in memory for signing
    // We don't store this; we compute it on-the-fly from the Seed
    const privateKey = await this.keyService.derivePrivateKey(
      wallet.getSeedPhrase(), 
      account.derivationPath
    );

    // 4. Broadcast to the specific blockchain
    const transaction = await this.blockchainService.transfer(
      network,
      privateKey, // Used by Infrastructure to sign the REST/JSON-RPC call
      toAddress,
      amount
    );
    console.log("Transaction created ", transaction);
  }
}
