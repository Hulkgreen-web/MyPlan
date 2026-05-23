import { defineConfig } from '@mikro-orm/postgresql';
import { Todo } from './entities/Todo.js';
import { User } from './entities/User.js';
import { RefreshToken } from './entities/RefreshToken.js';

export default defineConfig({
  entities: [Todo, User, RefreshToken],
  dbName: 'dev_db',
  user: 'root',
  password: 'password',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  debug: true,
  allowGlobalContext: true, // Simplified for boilerplate
});
