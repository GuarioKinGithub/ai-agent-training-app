import { eq } from 'drizzle-orm';
import { users } from '../db/schema';
import { BaseRepository } from './base-repository';
import db from '../config/database';

export class UserRepository extends BaseRepository<typeof users> {
  constructor() {
    super(users);
  }

  public async findByEmail(email: string) {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return results[0] || null;
  }
}

export const userRepository = new UserRepository();