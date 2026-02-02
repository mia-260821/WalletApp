import { Mnemonic, HDNodeWallet, ethers } from 'ethers';
import * as btc from '@scure/btc-signer';
// @ts-ignore
import { secp256k1 } from '@noble/curves/secp256k1';
import { Keypair } from '@solana/web3.js';

import { IKeyDerivationService } from '../../domain/services/IKeyDerivationService';
import { SeedPhrase } from '../../domain/value-objects/SeedPhrase';
import { PrivateKey } from '../../domain/value-objects/PrivateKey';
import { NetworkType } from '../../domain/services/CoinTypePolicy';

export class KeyDerivationService implements IKeyDerivationService {
  
  /**
   * Derives a network-specific public address from a seed phrase and path.
   */
  async deriveAddress(seed: SeedPhrase, path: string, network: NetworkType): Promise<string> {
    const privKey = await this.derivePrivateKey(seed, path);
    const privKeyBytes = privKey.toUint8Array()

    switch (network) {
      case NetworkType.ETHEREUM: {
        // EVM chains (Ethereum, Polygon, etc.) use the standard 0x address
        const wallet = new ethers.Wallet(privKey.getValue());
      return wallet.address;
      }

      case NetworkType.BITCOIN: {
        // Modern Native SegWit (bech32) starts with 'bc1q'
        const publicKey = secp256k1.getPublicKey(privKeyBytes, true);
        const { address } = btc.p2wpkh(publicKey);
        if (!address) throw new Error("Failed to derive Bitcoin address");
        return address;
      }

      case NetworkType.SOLANA: {
        // Solana uses Ed25519; we use the first 32 bytes of the derived seed/key
        const keypair = Keypair.fromSeed(privKeyBytes.slice(0, 32));
        return keypair.publicKey.toBase58();
      }

      default:
        throw new Error(`Unsupported network type: ${network}`);
    }
  }

  /**
   * Generates a PrivateKey Value Object from the seed.
   * This is used internally for signing transactions.
   */
  async derivePrivateKey(seed: SeedPhrase, path: string): Promise<PrivateKey> {
    // 1. Create a Mnemonic instance for BIP-39 math
    const mnemonic = Mnemonic.fromPhrase(seed.getValue());
    
    // 2. Derive the HD Node from the path (e.g., m/44'/60'/0'/0/0)
    const node = HDNodeWallet.fromMnemonic(mnemonic, path);
    
    // 3. Return our Domain Value Object containing the raw 0x hex
    return new PrivateKey(node.privateKey);
  }
}
