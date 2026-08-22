import { vi } from 'vitest';
import { TransactionMock, mockTransactionList } from './transactionsMock.js';
import { mockUserList, UserMock } from './usersMock.js';

export const createMockEntityManager = (initialData: TransactionMock[] = mockTransactionList, userMocks: UserMock[] = mockUserList) => {
    let dbStore = [...initialData];
    let userStore = [...userMocks];

    const mockEm = {
        find: vi.fn().mockImplementation(async (entity: any, filter: any) => {
            if (filter?.user) {
                return dbStore.filter((ts) => ts.userId === filter.user);
            }
            return dbStore;
        }),

        findAll: vi.fn().mockImplementation(async (entity: any) => {
            return userStore;
        }),

        findOne: vi.fn().mockImplementation(async (entity: any, filter: any) => {
            if (filter === 'user1@example.com' || filter?.email === 'user1@example.com') {
                return userStore.find((u) => u.email === 'user1@example.com');
            }
        }),

        findOneOrFail: vi.fn().mockImplementation(async (entity: any, filter: any) => {
            if (filter === 'user1@example.com' || filter?.email === 'user1@example.com') {
                return userStore.find((u) => u.email === 'user1@example.com');
            }
            
            if (filter === 'user-1' || filter?.id === 'user-1') {
                return userStore.find((u) => u.id === 'user-1');
            }

            const idToFind = typeof filter === 'string' ? filter : filter?.id;
            const found = dbStore.find((ts) => ts.id === idToFind);

            if (!found) {
                const error = new Error(`Entity not found`);
                (error as any).name = 'NotFoundError';
                throw error;
            }

            return found;
        }),

        persist: vi.fn().mockImplementation((entity: any) => {
            if (!entity.id) entity.id = `ts-1`;
            dbStore.push(entity);
            return mockEm;
        }),

        flush: vi.fn().mockResolvedValue(undefined),
        fork: vi.fn().mockReturnThis(),

        
        __resetStore: (newData = mockTransactionList) => {
        dbStore = [...newData];
        },
  };

  return mockEm;
};
