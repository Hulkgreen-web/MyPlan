import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.js';

@Entity()
export class Transaction {
    @PrimaryKey({ type: 'uuid' })
    id : string = uuidv4();

    @Property({ type: 'string', length: 100 })
    name!: string;

    @Property({ type: 'datetime'})
    transactionDate!: Date;

    @Property({ type: 'number' })
    amount!: number;

    @Property({ type: 'string' })
    type!: string;

    /*@ManyToOne(() => User)
    user!: User;*/

    constructor(name: string, transactionDate: Date, amount: number, type: string) {
        this.name = name;
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.type = type;
    }
}