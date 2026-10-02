export class UserEmail {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Email must be a non-empty string');
    }
    const normalized = value.trim().toLowerCase();
    if (!UserEmail.EMAIL_REGEX.test(normalized)) {
      throw new Error('Email format is invalid');
    }
    this._value = normalized;
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  equals(other?: UserEmail | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
