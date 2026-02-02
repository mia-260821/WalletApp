import { Address } from "../value-objects/Address";
import { NetworkType } from "./CoinTypePolicy";
import { PrivateKey } from "../value-objects/PrivateKey";
import { Transaction } from "../entities/Transaction";


export interface IBlockchainService {
    transfer(
      network: NetworkType,
      privateKey: PrivateKey, // Used by Infrastructure to sign the REST/JSON-RPC call
      to: Address,
      amount: number
    ): Promise<Transaction>
}