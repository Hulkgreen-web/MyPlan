import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Todo {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuidv4();

  @Property({ type: 'string', length: 100 })
  title!: string;

  @Property({ type: 'string', nullable: true })
  description?: string;

  @Property({ type: 'boolean' })
  completed: boolean = false;

  @Property({ type: 'datetime' })
  createdAt: Date = new Date();

  @Property({ type: 'datetime', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
  
  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
  }
}
