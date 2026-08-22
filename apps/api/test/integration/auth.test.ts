import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockEntityManager } from "../mocks/entityManagerMock.js";
import { mockUserList, mockUser1 } from "../mocks/usersMock.js";
import { RefreshToken } from "../../src/entities/RefreshToken.js";
import { MikroORM } from "@mikro-orm/postgresql";
import { buildApp } from "../../src/app.js";

vi.mock('@mikro-orm/postgresql', async () => {
    const actual = await vi.importActual('@mikro-orm/postgresql');
    return {
        ...actual,
        MikroORM: { init: vi.fn() },
    };
});

describe('Auth Routes', () => {
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

    describe('POST /auth/login', () => {
        it('should return a valid token for valid credentials', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'user1@example.com',
                    password: 'password1',
                },
            });

            const body = JSON.parse(response.body);
            expect(response.statusCode).toBe(200);
            expect(body.user.email).toBe("user1@example.com");
            expect(body.accessToken).toBeDefined();
        });

        it('should return 401 for invalid password', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'user1@example.com',
                    password: 'wrongpassword',
                },
            });

            expect(response.statusCode).toBe(401);
            expect(response.body).toContain('Invalid credentials');
        });

        it('should return 401 for non-existent user', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: 'nonexistent@example.com',
                    password: 'password',
                },
            });

            expect(response.statusCode).toBe(401);
            expect(response.body).toContain('Invalid credentials');
        });
    });

    describe('POST /auth/register', () => {
        it('should register a new user and return a valid token', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/register',
                payload: {
                    email: 'newuser@example.com',
                    password: 'password',
                    name: 'New User',
                },
            });

            const body = JSON.parse(response.body);
            expect(response.statusCode).toBe(201);
            expect(body.message).toBe("User with email newuser@example.com created successfully");
        });
    });

    describe('POST /auth/refresh', () => {
        it('should return a new access token for a valid refresh token', async () => {
            const validToken = 'valid-token';
            mockEm.findOne.mockImplementation(async (entity: any, filter: any) => {
                if (entity === RefreshToken && filter?.token === validToken) {
                    return {
                        token: validToken,
                        user: mockUser1,
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                    };
                }
                return null;
            });

            const response = await app.inject({
                method: 'POST',
                url: '/auth/refresh',
                cookies: {
                    refreshToken: validToken
                }
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.accessToken).toBeDefined();
            expect(body.user).toBeDefined();
            expect(body.user.email).toBe(mockUser1.email);
            expect(body.user.id).toBe(mockUser1.id);
            expect(body.user.name).toBe(mockUser1.name);
        });

        it('should return 401 if no refresh token is provided', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/auth/refresh',
            });

            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('No refresh token');
        });

        it('should return 401 if refresh token is invalid (not found in database)', async () => {
            mockEm.findOne.mockImplementation(async (entity: any, filter: any) => {
                return null;
            });

            const response = await app.inject({
                method: 'POST',
                url: '/auth/refresh',
                cookies: {
                    refreshToken: 'invalid-token'
                }
            });

            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Invalid or expired refresh token');
        });

        it('should return 401 if refresh token has expired', async () => {
            const expiredToken = 'expired-token';
            mockEm.findOne.mockImplementation(async (entity: any, filter: any) => {
                if (entity === RefreshToken && filter?.token === expiredToken) {
                    return {
                        token: expiredToken,
                        user: mockUser1,
                        expiresAt: new Date(Date.now() - 1000)
                    };
                }
                return null;
            });

            const response = await app.inject({
                method: 'POST',
                url: '/auth/refresh',
                cookies: {
                    refreshToken: expiredToken
                }
            });

            expect(response.statusCode).toBe(401);
            const body = JSON.parse(response.body);
            expect(body.message).toBe('Invalid or expired refresh token');
        });
    });
});