import { UserId, UserEmail, UserName } from '../value-objects/index.ts';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: UserEmail,
    private readonly _name: UserName,
    private readonly _createdAt?: Date,
    private readonly _updatedAt?: Date
  ) {
    Object.freeze(this);
  }

  get id(): string {
    return this._id.value;
  }

  get email(): string {
    return this._email.value;
  }

  get name(): string {
    return this._name.value;
  }

  get initials(): string {
    return this._name.initials;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get idVO(): UserId {
    return this._id;
  }

  get emailVO(): UserEmail {
    return this._email;
  }

  get nameVO(): UserName {
    return this._name;
  }

  static create(props: {
    id: string;
    email: string;
    name: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }): User {
    return new User(
      new UserId(props.id),
      new UserEmail(props.email),
      new UserName(props.name),
      props.createdAt ? new Date(props.createdAt) : undefined,
      props.updatedAt ? new Date(props.updatedAt) : undefined
    );
  }
}
