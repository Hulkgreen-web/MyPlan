import { vi } from 'vitest';
import { TransactionMock, mockTransactionList } from './transactionsMock.js';
import { mockUserList, UserMock } from './usersMock.js';
import { CategoryMock, mockCategoryList } from './categoriesMock.js';
import { Category } from '../../src/entities/Category.js';

export const createMockEntityManager = (
    initialData: TransactionMock[] = mockTransactionList,
    userMocks: UserMock[] = mockUserList,
    categoryMocks: CategoryMock[] = mockCategoryList
) => {
    let dbStore = [...initialData];
    let userStore = [...userMocks];
    let categoryStore = [...categoryMocks];

    const mockEm = {
        find: vi.fn().mockImplementation(async (entity: any, filter: any) => {
            if (entity === Category || entity?.name === 'Category') {
                return categoryStore;
            }
            if (filter?.user) {
                return dbStore.filter((ts) => ts.userId === filter.user);
            }
            return dbStore;
        }),

        findAll: vi.fn().mockImplementation(async (entity: any) => {
            if (entity === Category || entity?.name === 'Category') {
                return categoryStore;
            }
            return userStore;
        }),

        findOne: vi.fn().mockImplementation(async (entity: any, filter: any) => {
            if (filter === 'user1@example.com' || filter?.email === 'user1@example.com') {
                return userStore.find((u) => u.email === 'user1@example.com');
            }
            if (entity === Category || entity?.name === 'Category') {
                const idToFind = typeof filter === 'string' ? filter : filter?.id;
                return categoryStore.find((c) => c.id === idToFind);
            }
        }),

        findOneOrFail: vi.fn().mockImplementation(async (entity: any, filter: any) => {
            if (filter === 'user1@example.com' || filter?.email === 'user1@example.com') {
                return userStore.find((u) => u.email === 'user1@example.com');
            }
            
            if (filter === 'user-1' || filter?.id === 'user-1') {
                return userStore.find((u) => u.id === 'user-1');
            }

            if (entity === Category || entity?.name === 'Category') {
                const idToFind = typeof filter === 'string' ? filter : filter?.id;
                const foundCategory = categoryStore.find((c) => c.id === idToFind);
                if (!foundCategory) {
                    const error = new Error(`Category not found`);
                    (error as any).name = 'NotFoundError';
                    throw error;
                }
                return foundCategory;
            }

            const idToFind = typeof filter === 'string' ? filter : filter?.id;
            const foundCategory = categoryStore.find((c) => c.id === idToFind);
            if (foundCategory) {
                return foundCategory;
            }

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

        __resetStore: (newData = mockTransactionList, newCategories = mockCategoryList) => {
            dbStore = [...newData];
            categoryStore = [...newCategories];
        },
    };

    return mockEm;
};
