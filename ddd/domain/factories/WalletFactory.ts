import { ethers, Mnemonic } from 'ethers';
import { Wallet } from '../entities/Wallet';
import { SeedPhrase } from '../value-objects/SeedPhrase';
import { generateId } from '../utils/IdGenerator';

export class WalletFactory {
  /**
   * Creates a brand new wallet with a fresh seed phrase.
   */
  static createNew(): Wallet {
    // 1. Generate 16 bytes of cryptographically secure random data (entropy)
    // 16 bytes = 128 bits, which corresponds to a 12-word mnemonic.
    const entropy = ethers.randomBytes(16); 
    
    // 2. Convert the raw random bytes into the human-readable 12-word mnemonic phrase.
    // This process automatically adds the required checksum word.
    const randomMnemonic = Mnemonic.entropyToPhrase(entropy);

    // 3. Generate a unique ID for this wallet instance
    const id = generateId();
    
    // 4. Wrap the mnemonic in our Domain Value Object, which validates the checksum
    const seed = new SeedPhrase(randomMnemonic);

    // 5. Return the new Wallet Aggregate Root
    return new Wallet(id, seed);
  }
}


export const generate24Words = (): string => {
    return Mnemonic.entropyToPhrase(ethers.randomBytes(32)); 
};