import { TransactionType } from 'shared';
import {
  TransactionId,
  TransactionName,
  TransactionAmount,
  TransactionDate,
  TransactionTypeVO,
} from '../value-objects/index.ts';

export interface CreateTransactionParams {
  name: string;
  amount: number;
  transactionDate: Date;
  type: TransactionType;
}

export class Transaction {
  constructor(
    private readonly _id: TransactionId,
    private readonly _name: TransactionName,
    private readonly _amount: TransactionAmount,
    private readonly _transactionDate: TransactionDate,
    private readonly _type: TransactionTypeVO
  ) {
    Object.freeze(this);
  }

  // Primitive getters ensuring full compatibility with existing UI components
  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name.value;
  }

  get amount(): number {
    return this._amount.value;
  }

  get transactionDate(): Date {
    return this._transactionDate.value;
  }

  get type(): TransactionType {
    return this._type.value;
  }

  // Rich Value Object accessors
  get idVO(): TransactionId {
    return this._id;
  }

  get nameVO(): TransactionName {
    return this._name;
  }

  get amountVO(): TransactionAmount {
    return this._amount;
  }

  get dateVO(): TransactionDate {
    return this._transactionDate;
  }

  get typeVO(): TransactionTypeVO {
    return this._type;
  }

  isIncome(): boolean {
    return this._type.isIncome();
  }

  isExpense(): boolean {
    return this._type.isExpense();
  }

  // Factory constructor guaranteeing valid domain invariants
  static create(props: {
    id: string;
    name: string;
    amount: number;
    transactionDate: Date | string;
    type: TransactionType | string;
  }): Transaction {
    return new Transaction(
      new TransactionId(props.id),
      new TransactionName(props.name),
      new TransactionAmount(props.amount),
      new TransactionDate(props.transactionDate),
      new TransactionTypeVO(props.type)
    );
  }
}
