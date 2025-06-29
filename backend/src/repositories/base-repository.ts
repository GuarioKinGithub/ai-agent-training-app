import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';
import db from '../config/database';

export abstract class BaseRepository<T extends SQLiteTable> {
  constructor(protected table: T) {}

  public async findAll() {
    return await db.select().from(this.table);
  }

  public async findById(id: string) {
    const results = await db
      .select()
      .from(this.table)
      .where(eq((this.table as any).id, id))
      .limit(1);

    return results[0] || null;
  }

  public async create(data: any) {
    const results = await db.insert(this.table).values(data).returning();

    return results[0];
  }

  public async update(id: string, data: any) {
    const results = await db
      .update(this.table)
      .set(data)
      .where(eq((this.table as any).id, id))
      .returning();

    return results[0] || null;
  }

  public async delete(id: string) {
    const results = await db
      .delete(this.table)
      .where(eq((this.table as any).id, id))
      .returning();

    return results[0] || null;
  }
}