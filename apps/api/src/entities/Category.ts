import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from "./Transaction.js";
import { Collection } from "@mikro-orm/core";


@Entity()
export class Category {
    @PrimaryKey({ type: 'uuid' })
    id : string = uuidv4();

    @Property({ type: 'string', length: 100, unique: true })
    name!: string;

    @Property({ type: 'double' })
    estimatedAmount!: number;

    @OneToMany(() => Transaction, transaction => transaction.category)
    transactions = new Collection<Transaction>(this);

    constructor(name: string, estimatedAmount: number) {
        this.name = name;
        this.estimatedAmount = estimatedAmount;
        this.transactions = new Collection<Transaction>(this);
    }
}