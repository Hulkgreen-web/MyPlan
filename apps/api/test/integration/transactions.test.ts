import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildApp } from '../../src/app.js';
import { MikroORM } from '@mikro-orm/postgresql';

vi.mock('@mikro-orm/postgresql', async () => {
  const actual = await vi.importActual('@mikro-orm/postgresql');
  return {
    ...actual,
    MikroORM: {
      init: vi.fn(),
    },
  };
});

describe('Transaction Routes', () => {
  let app: any;
  let mockEm: any;

  beforeEach(async () => {
    mockEm = {
      find: vi.fn(),
      findOneOrFail: vi.fn(),
      persist: vi.fn(),
      flush: vi.fn(),
      fork: vi.fn().mockReturnThis(),
    };

    const mockOrm = {
      em: mockEm,
      getSchemaGenerator: vi.fn().mockReturnValue({
        updateSchema: vi.fn(),
      }),
    } as unknown as MikroORM;

    (MikroORM.init as any).mockResolvedValue(mockOrm);

    app = await buildApp(mockOrm);
    
    // Mock JWT verification
    app.addHook('onRequest', async (request: any) => {
      request.jwtVerify = vi.fn().mockResolvedValue({ sub: 'user-1' });
      request.user = { sub: 'user-1' };
    });
  });

  describe('GET /transactions', () => {
    it('should return all transactions for the user', async () => {
      const mockTransactions = [
        { id: '1', name: 'Test 1', amount: 100, type: 'income', transactionDate: new Date() },
      ];
      mockEm.find.mockResolvedValue(mockTransactions);

      const response = await app.inject({
        method: 'GET',
        url: '/transactions',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveLength(1);
      expect(mockEm.find).toHaveBeenCalledWith(expect.anything(), { user: 'user-1' }, expect.anything());
    });
  });

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const payload = {
        name: 'New Transaction',
        amount: 75.5,
        type: 'expense',
        transactionDate: '2024-05-23T10:00:00.000Z',
      };

      mockEm.findOneOrFail.mockResolvedValue({ id: 'user-1', name: 'Test User' });

      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.name).toBe(payload.name);
      expect(mockEm.persist).toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should return 400 for invalid payload', async () => {
      const payload = {
        name: '', // invalid
        amount: -10,
        type: 'INVALID_TYPE',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload,
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
