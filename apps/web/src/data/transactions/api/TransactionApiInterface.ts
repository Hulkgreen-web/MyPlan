import { CreateTransaction, TransactionResponse } from "shared";

export interface TransactionApiInterface {
  fetchTransactions(): Promise<TransactionResponse[]>;
  postTransaction(data: CreateTransaction): Promise<TransactionResponse>;
}