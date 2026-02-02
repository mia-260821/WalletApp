import { PrivateKey } from "../value-objects/PrivateKey";

export interface IChainSigner {
  signAndBroadcast(to: string, amount: number, privateKey: PrivateKey): Promise<string>;
  getAddress(privateKey: PrivateKey): string;
}