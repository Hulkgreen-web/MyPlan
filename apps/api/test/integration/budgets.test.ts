import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../../src/app.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { mockBudget1, mockBudgetList } from '../mocks/budgetsMock.js';
import { createMockEntityManager } from '../mocks/entityManagerMock.js';
import { Budget } from '../../src/entities/Budget.js';

vi.mock('@mikro-orm/postgresql', async () => {
  const actual = await vi.importActual('@mikro-orm/postgresql');
  return {
    ...actual,
    MikroORM: { init: vi.fn() },
  };
});

describe('Budget Routes', () => {
  let app: any;
  let mockEm: ReturnType<typeof createMockEntityManager>;

  beforeEach(async () => {
    mockEm = createMockEntityManager([], [], mockBudgetList);

    const mockOrm = {
      em: mockEm,
      schema: { update: vi.fn() },
      getSchemaGenerator: vi.fn().mockReturnValue({ updateSchema: vi.fn() }),
    } as unknown as MikroORM;

    (MikroORM.init as any).mockResolvedValue(mockOrm);

    app = await buildApp(mockOrm);

    app.addHook('onRequest', async (request: any) => {
      request.jwtVerify = vi.fn().mockResolvedValue({ sub: 'user-1' });
      request.user = { sub: 'user-1' };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /budget', () => {
    it('should return the budget for the authenticated user with status 200', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/budget',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body).toEqual({
        id: mockBudget1.id,
        amount: mockBudget1.amount,
        updatedAt: mockBudget1.updatedAt.toISOString(),
      });
      expect(mockEm.findOne).toHaveBeenCalledWith(Budget, { user: 'user-1' });
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
        request.user = undefined;
      });

      const response = await app.inject({
        method: 'GET',
        url: '/budget',
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.message).toBe('Unauthorized');
    });

    it('should return 404 NOT FOUND if budget does not exist for the user', async () => {
      mockEm.findOne.mockResolvedValueOnce(null);

      const response = await app.inject({
        method: 'GET',
        url: '/budget',
      });

      expect(response.statusCode).toBe(404);
      const body = response.json();
      expect(body.message).toBe('Budget not found');
    });

    it('should return 500 INTERNAL SERVER ERROR if database query fails', async () => {
      mockEm.findOne.mockRejectedValueOnce(new Error('Database query failure'));

      const response = await app.inject({
        method: 'GET',
        url: '/budget',
      });

      expect(response.statusCode).toBe(500);
      const body = response.json();
      expect(body.message).toBe('Internal Server Error');
    });
  });

  describe('PATCH /budget', () => {
    it('should add integer amount to budget and return 200 with updated data', async () => {
      const payload = { amount: 50 };
      const expectedAmount = mockBudget1.amount + payload.amount;

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body.id).toBe(mockBudget1.id);
      expect(body.amount).toBe(expectedAmount);
      expect(body.updatedAt).toBeDefined();
      expect(mockEm.assign).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockBudget1.id }),
        { amount: expectedAmount }
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should add float amount with 2 decimal places and return 200 with updated data', async () => {
      const payload = { amount: 25.25 };
      const expectedAmount = mockBudget1.amount + payload.amount;

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body.id).toBe(mockBudget1.id);
      expect(body.amount).toBe(expectedAmount);
      expect(body.updatedAt).toBeDefined();
      expect(mockEm.assign).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockBudget1.id }),
        { amount: expectedAmount }
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when amount field is missing', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: {},
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when amount is not a number', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: { amount: 'invalid-amount' },
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when amount has more than 2 decimal places', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: { amount: 50.123 },
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when amount is negative', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: { amount: -10 },
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
        request.user = undefined;
      });

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: { amount: 50 },
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.message).toBe('Unauthorized');
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 404 NOT FOUND if budget does not exist for the user', async () => {
      mockEm.findOne.mockResolvedValueOnce(null);

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: { amount: 50 },
      });

      expect(response.statusCode).toBe(404);
      const body = response.json();
      expect(body.message).toBe('Budget not found');
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 500 INTERNAL SERVER ERROR if database flush fails', async () => {
      mockEm.flush.mockRejectedValueOnce(new Error('Database flush failure'));

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget',
        payload: { amount: 50 },
      });

      expect(response.statusCode).toBe(500);
      const body = response.json();
      expect(body.message).toBe('Internal Server Error');
    });
  });

  describe('PATCH /budget/reset', () => {
    it('should reset budget amount to 0 and return 200 with updated data', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/budget/reset',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body).toEqual({
        id: mockBudget1.id,
        amount: 0,
        updatedAt: mockBudget1.updatedAt.toISOString(),
      });
      expect(mockEm.assign).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockBudget1.id }),
        { amount: 0 }
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
        request.user = undefined;
      });

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget/reset',
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.message).toBe('Unauthorized');
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 404 NOT FOUND if budget does not exist for the user', async () => {
      mockEm.findOne.mockResolvedValueOnce(null);

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget/reset',
      });

      expect(response.statusCode).toBe(404);
      const body = response.json();
      expect(body.message).toBe('Budget not found');
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 500 INTERNAL SERVER ERROR if database flush fails', async () => {
      mockEm.flush.mockRejectedValueOnce(new Error('Database flush failure'));

      const response = await app.inject({
        method: 'PATCH',
        url: '/budget/reset',
      });

      expect(response.statusCode).toBe(500);
      const body = response.json();
      expect(body.message).toBe('Internal Server Error');
    });
  });
});
