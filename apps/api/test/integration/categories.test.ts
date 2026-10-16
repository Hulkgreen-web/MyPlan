import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../../src/app.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { mockCategory1, mockCategory2, mockCategoryList } from '../mocks/categoriesMock.js';
import { createMockEntityManager } from '../mocks/entityManagerMock.js';

vi.mock('@mikro-orm/postgresql', async () => {
  const actual = await vi.importActual('@mikro-orm/postgresql');
  return {
    ...actual,
    MikroORM: { init: vi.fn() },
  };
});

describe('Category Routes', () => {
  let app: any;
  let mockEm: ReturnType<typeof createMockEntityManager>;

  beforeEach(async () => {
    mockEm = createMockEntityManager(undefined, undefined, [...mockCategoryList.map((c) => ({ ...c }))]);

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

  describe('GET /categories', () => {
    it('should return all categories with 200 OK', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/categories',
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(Array.isArray(body)).toBe(true);
      expect(body).toHaveLength(2);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('estimatedAmount');
      expect(body[0]).toHaveProperty('transactions');
      expect(typeof body[0].estimatedAmount).toBe('number');
      expect(Array.isArray(body[0].transactions)).toBe(true);
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
      });

      const response = await app.inject({
        method: 'GET',
        url: '/categories',
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('POST /categories', () => {
    it('should create a new category with a decimal amount and return 200 OK', async () => {
      const payload = {
        name: 'Loisirs & Sorties',
        estimatedAmount: 149.99,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body.name).toBe(payload.name);
      expect(body.estimatedAmount).toBe(149.99);
      expect(typeof body.estimatedAmount).toBe('number');
      expect(body.id).toBeDefined();
      expect(body.transactions).toEqual([]);
      expect(mockEm.persist).toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when trying to create a category with an already existing name', async () => {
      const payload = {
        name: mockCategory1.name, // Already exists in mockCategoryList ('Alimentation')
        estimatedAmount: 50.0,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload,
      });

      expect(response.statusCode).toBe(400);
      const body = response.json();
      expect(body.message).toContain('already exists');
      expect(mockEm.persist).not.toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST for a negative amount', async () => {
      const payload = {
        name: 'Sport',
        estimatedAmount: -30.5,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload,
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.persist).not.toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST for an amount with more than 2 decimal places', async () => {
      const payload = {
        name: 'Transport',
        estimatedAmount: 25.123,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload,
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.persist).not.toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when required fields are missing', async () => {
      const payload = {
        name: 'Voyage',
      };

      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload,
      });

      expect(response.statusCode).toBe(400);
      expect(mockEm.persist).not.toHaveBeenCalled();
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
      });

      const payload = {
        name: 'Santé',
        estimatedAmount: 75.5,
      };

      const response = await app.inject({
        method: 'POST',
        url: '/categories',
        payload,
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.message).toBe('Unauthorized');
      expect(mockEm.persist).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /categories/:id', () => {
    it('should update a category with decimal amount and return 200 OK', async () => {
      const payload = {
        name: 'Supermarché & Courses',
        estimatedAmount: 375.5,
      };

      const response = await app.inject({
        method: 'PATCH',
        url: `/categories/${mockCategory1.id}`,
        payload,
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();

      expect(body.id).toBe(mockCategory1.id);
      expect(body.name).toBe(payload.name);
      expect(body.estimatedAmount).toBe(375.5);
      expect(typeof body.estimatedAmount).toBe('number');
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it('should return 400 BAD REQUEST when updating name to an already existing category name', async () => {
      const payload = {
        name: mockCategory2.name, // Try renaming mockCategory1 to mockCategory2's name
      };

      const response = await app.inject({
        method: 'PATCH',
        url: `/categories/${mockCategory1.id}`,
        payload,
      });

      expect(response.statusCode).toBe(400);
      const body = response.json();
      expect(body.message).toContain('already exists');
    });

    it('should return 400 BAD REQUEST for invalid decimal amount on update', async () => {
      const payload = {
        estimatedAmount: -100,
      };

      const response = await app.inject({
        method: 'PATCH',
        url: `/categories/${mockCategory1.id}`,
        payload,
      });

      expect(response.statusCode).toBe(400);
    });

    it('should return 404 NOT FOUND when updating a non-existent category', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/categories/non-existent-id',
        payload: {
          name: 'Fantôme',
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('should return 401 UNAUTHORIZED if user is not authenticated', async () => {
      app.addHook('onRequest', async (request: any) => {
        request.jwtVerify = vi.fn().mockRejectedValue(new Error('Unauthorized'));
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/categories/${mockCategory1.id}`,
        payload: {
          name: 'Nouveau nom',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });
});
