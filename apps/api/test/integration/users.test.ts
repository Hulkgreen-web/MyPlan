import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockEntityManager } from "../mocks/entityManagerMock.js";
import { mockUserList } from "../mocks/usersMock.js";
import { MikroORM } from "@mikro-orm/postgresql";
import { buildApp } from "../../src/app.js";

vi.mock('@mikro-orm/postgresql', async () => {
  const actual = await vi.importActual('@mikro-orm/postgresql');
  return {
    ...actual,
    MikroORM: { init: vi.fn() },
  };
});

describe('User Routes', () => {
    let app: any;
    let mockEm: ReturnType<typeof createMockEntityManager>;

    beforeEach(async () => {
        mockEm = createMockEntityManager([], mockUserList);

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

    describe('GET /users', () => {
        it('should return all users', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/users',
            });
            
            const body = JSON.parse(response.body);
            expect(response.statusCode).toBe(200);
            expect(body).toHaveLength(mockUserList.length);
        });
    });
});