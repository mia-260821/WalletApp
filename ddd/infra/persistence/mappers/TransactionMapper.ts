
import { Transaction } from '../../../domain/entities/Transaction';
import { Address } from '../../../domain/value-objects/Address';
import { Balance } from '../../../domain/value-objects/Balance';

export class TransactionMapper {
  /**
   * Converts API response to Domain Entity
   */
  static toDomain(raw: any): Transaction {
    return new Transaction(
      raw.txHash || raw.id, // Identity
      new Address(raw.from),
      new Address(raw.to),
      new Balance(raw.amount),
      raw.status || 'confirmed', // Business state
      raw.timestamp || Date.now(),
      raw.network,
    );
  }

  /**
   * Optional: For saving to local history (AsyncStorage)
   */
  static toPersistence(tx: Transaction): any {
    return {
      id: tx.id,
      from: tx.from.getValue(),
      to: tx.to.getValue(),
      amount: tx.amount.getAmount(),
      status: tx.status,
      timestamp: tx.timestamp
    };
  }
}
