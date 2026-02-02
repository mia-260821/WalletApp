
// The public identifier for receiving funds.

export class Address {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error("Invalid Blockchain Address");
    }
    this.value = value;
  }

  private isValid(value: string): boolean {
    // Logic to validate ETH/BTC address format
    return value.startsWith('0x') && value.length === 42;
  }

  getValue(): string {
    return this.value;
  }
}
