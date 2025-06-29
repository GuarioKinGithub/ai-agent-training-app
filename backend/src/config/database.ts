import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from '../db/schema';

const sqlite = new Database(process.env.DATABASE_URL || './data.db', { create: true });
export const db = drizzle(sqlite, { schema });

export default db;