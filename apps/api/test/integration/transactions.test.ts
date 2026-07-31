import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../../src/app.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { mockTransaction1, mockTransactionList } from '../mocks/transactionsMock.js';
import { createMockEntityManager } from '../mocks/entityManagerMock.js';

vi.mock('@mikro-orm/postgresql', async () => {
  const actual = await vi.importActual('@mikro-orm/postgresql');
  return {
    ...actual,
    MikroORM: { init: vi.fn() },
  };
});

describe('Transaction Routes', () => {
  let app: any;
  let mockEm: ReturnType<typeof createMockEntityManager>;

  beforeEach(async () => {
    mockEm = createMockEntityManager(mockTransactionList);

    const mockOrm = {
      em: mockEm,
      getSchemaGenerator: vi.fn().mockReturnValue({ updateSchema: vi.fn() }),
    } as unknown as MikroORM;

    (MikroORM.init as any).mockResolvedValue(mockOrm);

    app = await buildApp(mockOrm);

    app.addHook('onRequest', async (request: any) => {
      request.jwtVerify = vi.fn().mockResolvedValue({ sub: 'user-1' });
      request.user = { sub: 'user-1' };
    });
  });

  afterEach( () => {
    vi.clearAllMocks();
  });

  describe('GET /transactions', () => {
    it('should return all transactions for the user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/transactions',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      
      expect(body).toHaveLength(2);
      expect(body[0].name).toBe(mockTransaction1.name);
      expect(mockEm.find).toHaveBeenCalledWith(expect.anything(), { user: 'user-1' }, expect.anything());
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
      });

      const response = await app.inject({
        method: 'GET',
        url: '/transactions',
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const payload = {
        name: 'Achat café',
        amount: 3.5,
        type: 'expense',
        transactionDate: '2024-05-23T10:00:00.000Z',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.name).toBe(payload.name);
      expect(body.amount).toBe(payload.amount);
      expect(body.type).toBe(payload.type);
      expect(new Date(body.transactionDate).toISOString()).toBe(payload.transactionDate);
      expect(mockEm.persist).toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST for invalid payload', async () => {
      const payload = {
        name: 'Achat Mac',
        amount: -15.20,
        type: 'expense',
        transactionDate: '2024-05-23T10:00:00.000Z',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload,
      });

      expect(response.statusCode).toBe(400);
      const body = response.json();
      console.log('Response body:', body);
      expect(mockEm.persist).not.toHaveBeenCalled();
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
      });

      const payload = {
        name: 'Achat café',
        amount: 3.5,
        type: 'expense',
        transactionDate: '2024-05-23T10:00:00.000Z',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload,
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Unauthorized');
      expect(mockEm.persist).not.toHaveBeenCalled();
      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });
});