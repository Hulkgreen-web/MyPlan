import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.js';

@Entity()
export class RefreshToken {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'string' })
  token!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'datetime' })
  expiresAt!: Date;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  constructor(token: string, user: User, expiresAt: Date) {
    this.token = token;
    this.user = user;
    this.expiresAt = expiresAt;
  }
}
