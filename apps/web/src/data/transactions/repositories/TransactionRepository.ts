import { CreateTransactionParams, Transaction } from '@domain/transactions/models/transaction.model.ts';
import { TransactionRepository as ITransactionRepository } from '@domain/transactions/repositories/transaction.repository.ts';
import { TransactionApiInterface } from '../api/TransactionApiInterface.ts';
import { TransactionMapper } from '../mappers/TransactionMapper.ts';

export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly transactionApi: TransactionApiInterface) {}

  async getTransactions(): Promise<Transaction[]> {
    const dtos = await this.transactionApi.fetchTransactions();
    return dtos.map(TransactionMapper.toDomain);
  }

  async createTransaction(params: CreateTransactionParams): Promise<Transaction> {
    const dto = TransactionMapper.toDto(params);
    const createdDto = await this.transactionApi.postTransaction(dto);
    return TransactionMapper.toDomain(createdDto);
  }
}
