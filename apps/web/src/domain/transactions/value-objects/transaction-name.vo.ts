export class TransactionName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Transaction name must be a non-empty string');
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error('Transaction name cannot be empty');
    }
    if (trimmed.length > 100) {
      throw new Error('Transaction name cannot exceed 100 characters');
    }
    this._value = trimmed;
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  equals(other?: TransactionName | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
