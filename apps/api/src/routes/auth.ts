import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcrypt';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { User } from '../entities/User.js';
import { RefreshToken } from '../entities/RefreshToken.js';
import { LoginSchema, RegisterSchema } from 'shared';

export const authRoutes: FastifyPluginAsync<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.post('/register', async (request, reply) => {
    const data = RegisterSchema.parse(request.body);
    
    const existing = await em.findOne(User, { email: data.email });
    if (existing) return reply.status(400).send({ message: 'User already exists' });

    const user = new User(data.email, data.name);
    user.password = await bcrypt.hash(data.password, 10);
    
    await em.persistAndFlush(user);
    return { user };
  });

  fastify.post('/login', async (request, reply) => {
    const data = LoginSchema.parse(request.body);
    const user = await em.findOne(User, { email: data.email });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const accessToken = fastify.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });
    const refreshTokenValue = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const refreshToken = new RefreshToken(
      refreshTokenValue, 
      user, 
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    await em.persistAndFlush(refreshToken);

    reply.setCookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return { user, accessToken };
  });

  fastify.post('/refresh', async (request, reply) => {
    const token = request.cookies.refreshToken;
    if (!token) return reply.status(401).send({ message: 'No refresh token' });

    const storedToken = await em.findOne(RefreshToken, { token }, { populate: ['user'] });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return reply.status(401).send({ message: 'Invalid or expired refresh token' });
    }

    const user = storedToken.user;
    const accessToken = fastify.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });
    
    return { 
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  });

  fastify.post('/logout', async (request, reply) => {
    const token = request.cookies.refreshToken;
    if (token) {
      const storedToken = await em.findOne(RefreshToken, { token });
      if (storedToken) await em.removeAndFlush(storedToken);
    }
    reply.clearCookie('refreshToken');
    return { success: true };
  });

  fastify.get('/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      const user = await em.findOne(User, { id: (request.user as any).sub });
      return { user };
    } catch (err) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });
};
