import { buildApp } from './app.js';

const start = async () => {
  const fastify = await buildApp();

  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
