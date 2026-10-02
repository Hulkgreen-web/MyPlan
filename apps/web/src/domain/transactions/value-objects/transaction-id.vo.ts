export class TransactionId {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Transaction ID cannot be empty');
    }
    this._value = value.trim();
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  equals(other?: TransactionId | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
