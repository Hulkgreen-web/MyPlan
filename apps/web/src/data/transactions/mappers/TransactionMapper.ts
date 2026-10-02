import { CreateTransaction, TransactionResponse } from 'shared';
import { CreateTransactionParams, Transaction } from '@domain/transactions/models/transaction.model.ts';

export class TransactionMapper {
  static toDomain(dto: TransactionResponse): Transaction {
    return Transaction.create({
      id: dto.id,
      name: dto.name,
      amount: Number(dto.amount),
      transactionDate: dto.transactionDate,
      type: dto.type,
    });
  }

  static toDto(domain: CreateTransactionParams): CreateTransaction {
    return {
      name: domain.name,
      amount: domain.amount,
      transactionDate: domain.transactionDate,
      type: domain.type,
    };
  }
}