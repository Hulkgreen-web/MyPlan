export class TransactionAmount {
  private readonly _value: number;

  constructor(value: number) {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      throw new Error('Transaction amount must be a valid finite number');
    }
    if (value <= 0) {
      throw new Error('Transaction amount must be strictly greater than 0');
    }
    const rounded = Math.round(value * 100) / 100;
    if (Math.abs(value - rounded) > 0.0001) {
      throw new Error('Transaction amount cannot have more than 2 decimal places');
    }
    this._value = rounded;
    Object.freeze(this);
  }

  get value(): number {
    return this._value;
  }

  get formatted(): string {
    return `${this._value.toFixed(2)} €`;
  }

  equals(other?: TransactionAmount | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }

  toString(): string {
    return this.formatted;
  }
}
