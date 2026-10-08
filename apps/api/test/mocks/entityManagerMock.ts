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
                if (typeof filter === 'string') {
                    return categoryStore.find((c) => c.id === filter);
                }
                if (filter?.name) {
                    return categoryStore.find((c) => c.name === filter.name);
                }
                if (filter?.id) {
                    return categoryStore.find((c) => c.id === filter.id);
                }
            }
            return null;
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
                const nameToFind = filter?.name;
                const foundCategory = categoryStore.find((c) => (idToFind && c.id === idToFind) || (nameToFind && c.name === nameToFind));
                if (!foundCategory) {
                    const error = new Error(`Category not found`);
                    (error as any).name = 'NotFoundError';
                    (error as any).statusCode = 404;
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
                (error as any).statusCode = 404;
                throw error;
            }

            return found;
        }),

        persist: vi.fn().mockImplementation((entity: any) => {
            if (entity instanceof Category || entity?.constructor?.name === 'Category' || entity?.estimatedAmount !== undefined) {
                if (!entity.id) entity.id = `cat-${Date.now()}`;
                categoryStore.push(entity);
                return mockEm;
            }
            if (!entity.id) entity.id = `ts-${Date.now()}`;
            dbStore.push(entity);
            return mockEm;
        }),

        remove: vi.fn().mockImplementation((entity: any) => {
            if (entity instanceof Category || entity?.constructor?.name === 'Category' || entity?.estimatedAmount !== undefined) {
                categoryStore = categoryStore.filter((c) => c.id !== entity.id);
            } else {
                dbStore = dbStore.filter((ts) => ts.id !== entity.id);
            }
            return mockEm;
        }),

        assign: vi.fn().mockImplementation((entity: any, data: any) => {
            Object.assign(entity, data);
            return entity;
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
