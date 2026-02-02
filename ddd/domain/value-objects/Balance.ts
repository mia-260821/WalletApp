
// The amount of currency currently held by an address.

export class Balance {
  constructor(private readonly amount: number) {
    if (amount < 0) {
      throw new Error("Balance cannot be negative");
    }
  }

  getAmount(): number {
    return this.amount;
  }
}
