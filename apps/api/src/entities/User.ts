import { Cascade } from '@mikro-orm/core';
import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';
import { Budget } from './Budget.js';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string', hidden: true })
  password!: string;

  @Property({ type: 'string' })
  name!: string;

  @OneToOne(() => Budget, { mappedBy: 'user', cascade: [Cascade.ALL], orphanRemoval: true })
  budget!: Budget;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
    this.budget = new Budget(0, this);
  }
}
