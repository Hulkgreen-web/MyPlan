import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../../src/app.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { createMockEntityManager } from '../mocks/entityManagerMock.js';

vi.mock('@mikro-orm/postgresql', async () => {
  const actual = await vi.importActual('@mikro-orm/postgresql');
  return {
    ...actual,
    MikroORM: { init: vi.fn() },
  };
});

describe('Swagger Documentation', () => {
  let app: any;

  beforeEach(async () => {
    const mockEm = createMockEntityManager();
    const mockOrm = {
      em: mockEm,
      schema: { update: vi.fn() },
      getSchemaGenerator: vi.fn().mockReturnValue({ updateSchema: vi.fn() }),
    } as unknown as MikroORM;

    (MikroORM.init as any).mockResolvedValue(mockOrm);
    app = await buildApp(mockOrm);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should serve Swagger UI on /documentation', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/documentation',
    });

    // Fastify Swagger UI redirects /documentation to /documentation/ or returns 200
    expect([200, 302]).toContain(response.statusCode);
  });

  it('should return valid OpenAPI JSON specification on /documentation/json', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/documentation/json',
    });

    expect(response.statusCode).toBe(200);
    const json = response.json();
    expect(json.openapi).toMatch(/^3\./);
    expect(json.info.title).toBe('MyPlan API');
    expect(json.paths).toBeDefined();
    expect(json.paths['/auth/login']).toBeDefined();
    expect(json.paths['/transactions/']).toBeDefined();
    expect(json.paths['/users/']).toBeDefined();
  });
});
