import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';

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

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}
