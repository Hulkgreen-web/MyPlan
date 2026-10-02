import { CreateTransaction, TransactionResponse } from "shared";
import { TransactionApiInterface } from "./TransactionApiInterface.ts";
import { apiFetch } from "@/api.ts";

export class TransactionApi implements TransactionApiInterface {
    async fetchTransactions(): Promise<TransactionResponse[]> {
        const response = await apiFetch('/transactions');
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to fetch transactions from server');
        }
        return response.json();
      }
    
      async postTransaction(data: CreateTransaction): Promise<TransactionResponse> {
        const response = await apiFetch('/transactions', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to create transaction on server');
        }
        return response.json();
      }
}