import { Transaction, CreateTransactionParams } from '../models/transaction.model.ts';
import { TransactionRepository } from '../repositories/transaction.repository.ts';
import {
  TransactionName,
  TransactionAmount,
  TransactionDate,
  TransactionTypeVO,
} from '../value-objects/index.ts';

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: CreateTransactionParams): Promise<Transaction> {
    // Validation handled by domain Value Objects
    const name = new TransactionName(params.name);
    const amount = new TransactionAmount(params.amount);
    const transactionDate = new TransactionDate(params.transactionDate ?? new Date());
    const type = new TransactionTypeVO(params.type);

    return this.transactionRepository.createTransaction({
      name: name.value,
      amount: amount.value,
      transactionDate: transactionDate.value,
      type: type.value,
    });
  }
}
