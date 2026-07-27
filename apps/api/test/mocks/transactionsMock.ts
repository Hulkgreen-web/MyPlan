export interface TransactionMock {
  id: string;
  name: string;
  transactionDate: Date;
  amount: number;
  type: 'income' | 'expense';
  userId: string;
}

export const mockTransaction1: TransactionMock = {
    id: 'transaction-1',
    name: 'Salary',
    transactionDate: new Date('2026-01-01T10:00:00.000Z'),
    amount: 5000,
    type: 'income',
    userId: 'user-1',
}

export const mockTransaction2: TransactionMock = {
    id: 'transaction-2',
    name: 'Groceries',
    transactionDate: new Date('2026-01-02T10:00:00.000Z'),
    amount: 150,
    type: 'expense',
    userId: 'user-1',
}

export const mockTransactionList: TransactionMock[] = [
    mockTransaction1,
    mockTransaction2,
];

