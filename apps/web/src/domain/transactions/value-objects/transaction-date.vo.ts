export class TransactionDate {
  private readonly _value: Date;

  constructor(value: Date | string | number) {
    const parsed = value instanceof Date ? new Date(value.getTime()) : new Date(value);
    if (isNaN(parsed.getTime())) {
      throw new Error('Transaction date is invalid');
    }
    this._value = parsed;
    Object.freeze(this);
  }

  get value(): Date {
    return new Date(this._value.getTime());
  }

  toLocaleDateString(locale: string = 'fr-FR'): string {
    return this._value.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  equals(other?: TransactionDate | null): boolean {
    if (!other) return false;
    return this._value.getTime() === other.value.getTime();
  }

  toISOString(): string {
    return this._value.toISOString();
  }
}
