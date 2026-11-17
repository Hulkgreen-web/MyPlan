export interface BudgetMock {
  id: string;
  amount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mockBudget1: BudgetMock = {
  id: 'budget-1',
  amount: 100.5,
  userId: 'user-1',
  createdAt: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-01T10:00:00.000Z'),
};

export const mockBudget2: BudgetMock = {
  id: 'budget-2',
  amount: 0,
  userId: 'user-2',
  createdAt: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-01T10:00:00.000Z'),
};

export const mockBudgetList: BudgetMock[] = [
  mockBudget1,
  mockBudget2,
];
