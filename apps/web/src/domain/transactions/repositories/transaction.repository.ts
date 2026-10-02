import { Transaction, CreateTransactionParams } from '../models/transaction.model.ts';

export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  createTransaction(params: CreateTransactionParams): Promise<Transaction>;
}
