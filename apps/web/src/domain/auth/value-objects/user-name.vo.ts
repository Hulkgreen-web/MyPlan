export class UserName {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new Error('Name must be a non-empty string');
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
    if (trimmed.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }
    this._value = trimmed;
    Object.freeze(this);
  }

  get value(): string {
    return this._value;
  }

  get initials(): string {
    return this._value
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  equals(other?: UserName | null): boolean {
    if (!other) return false;
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}
