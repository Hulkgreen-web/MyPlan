import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { v4 as uuidv4 } from 'uuid';
import { User } from './User.js';
import { Category } from './Category.js';

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

    @ManyToOne(() => User)
    user!: User;

    @ManyToOne(() => Category)
    category!: Category;

    constructor(name: string, transactionDate: Date, amount: number, type: string, user: User, category: Category) {
        this.name = name;
        this.transactionDate = transactionDate;
        this.amount = amount;
        this.type = type;
        this.user = user;
        this.category = category;
    }
}