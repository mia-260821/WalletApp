import { Mnemonic } from 'ethers';

/**
 * A seed phrase is a sequence of 12 to 24 random words (e.g., "apple lunar shoe...") 
 * that represents a large, randomly generated number called entropy.
 * 
 */
export class SeedPhrase {
    private readonly value: string;

    constructor(value: string) {
        // In ethers v6, we use Mnemonic.fromPhrase() to validate
        // It will throw an error if the phrase is mathematically invalid or uses words not in the BIP-39 list
        try {
            Mnemonic.fromPhrase(value);
            this.value = value;
        } catch (error) {
            throw new Error("Invalid mnemonic phrase. Please check the words and order.");
        }
    }

    public getValue(): string {
        return this.value;
    }
}