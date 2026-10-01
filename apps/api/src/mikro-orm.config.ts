import { defineConfig } from '@mikro-orm/postgresql';
import { User } from './entities/User.js';
import { RefreshToken } from './entities/RefreshToken.js';
import { Transaction } from './entities/Transaction.js';

export default defineConfig({
  entities: [User, RefreshToken, Transaction],
  dbName: 'dev_db',
  user: 'root',
  password: 'password',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  debug: false,
  allowGlobalContext: true, // Simplified for boilerplate
});
