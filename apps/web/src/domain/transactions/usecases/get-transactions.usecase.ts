import { Transaction } from '../models/transaction.model.ts';
import { TransactionRepository } from '../repositories/transaction.repository.ts';

export class GetTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions();
  }
}
