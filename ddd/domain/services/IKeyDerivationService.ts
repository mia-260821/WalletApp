import { PrivateKey } from "../value-objects/PrivateKey";
import { SeedPhrase } from "../value-objects/SeedPhrase";
import { NetworkType } from "./CoinTypePolicy";

export interface IKeyDerivationService {
    deriveAddress(sseed: SeedPhrase, path: string, network: NetworkType): Promise<string>
    derivePrivateKey(seedPhrase: SeedPhrase, derivationPath: string): Promise<PrivateKey>
}
