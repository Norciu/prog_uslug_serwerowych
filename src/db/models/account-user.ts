import db from 'db';
import { Database } from 'db/db.type';
import { ColumnType, Generated, sql } from 'kysely';

export interface AccountUserTable {
  id: Generated<number>;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  city: string;
  street: string;
  zip_code: string;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, never, Date | string>;
}

export function AccountUserRepo() {
  const space: keyof Database = 'account.user';
  return {
    async exists(email: string) {
      const { exists } = await db
        .selectFrom(sql<{ exists: boolean }>`SELECT EXISTS (SELECT FROM "account"."user" WHERE "email" = ${email})`.as('user'))
        .select('user.exists')
        .executeTakeFirstOrThrow();

      return exists;
    },
    async getById(id: number) {
      return db.selectFrom(space).where('account.user.id', '=', id).execute();
    },
    async create(user: Omit<AccountUserTable, 'id' | 'created_at' | 'updated_at'>) {
      return db.insertInto(space).values(user).execute();
    },
  };
}

export default AccountUserRepo();
