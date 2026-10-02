import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, CreateTransactionParams } from '@domain/transactions/models/transaction.model.ts';
import { TransactionType } from 'shared';
import { useTransactionUseCases } from '@/CompositionRoot.tsx';

export function useTransactions() {
  const { getTransactionsUseCase, createTransactionUseCase } = useTransactionUseCases();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTransactionsUseCase.execute();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [getTransactionsUseCase]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(
    async (params: CreateTransactionParams): Promise<Transaction> => {
      const newTransaction = await createTransactionUseCase.execute(params);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    },
    [createTransactionUseCase]
  );

  const filteredTransactions = useMemo(() => {
    if (filter === 'income') {
      return transactions.filter((tx) => tx.type === TransactionType.INCOME);
    }
    if (filter === 'expense') {
      return transactions.filter((tx) => tx.type === TransactionType.EXPENSE);
    }
    return transactions;
  }, [transactions, filter]);

  return {
    transactions,
    filteredTransactions,
    isLoading,
    error,
    filter,
    setFilter,
    fetchTransactions,
    createTransaction,
  };
}
