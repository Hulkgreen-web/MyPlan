import { TransactionType } from 'shared';

export class TransactionTypeVO {
  private readonly _value: TransactionType;

  constructor(value: string | TransactionType) {
    if (value !== TransactionType.INCOME && value !== TransactionType.EXPENSE) {
      throw new Error(
        `Invalid transaction type: "${value}". Must be either "${TransactionType.INCOME}" or "${TransactionType.EXPENSE}"`
      );
    }
    this._value = value;
    Object.freeze(this);
  }

  get value(): TransactionType {
    return this._value;
  }

  isIncome(): boolean {
    return this._value === TransactionType.INCOME;
  }

  isExpense(): boolean {
    return this._value === TransactionType.EXPENSE;
  }

  equals(other?: TransactionTypeVO | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
