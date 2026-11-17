import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.js';

@Entity()
export class Budget {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'double' })
  amount: number = 0;

  @OneToOne(() => User, { inversedBy: 'budget', deleteRule: 'cascade' })
  user!: User;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(amount: number = 0, user?: User) {
    this.amount = amount;
    if (user) {
      this.user = user;
    }
  }
}