export class UserPassword {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    if (value.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    this._value = value;
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  equals(other?: UserPassword | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }
}
