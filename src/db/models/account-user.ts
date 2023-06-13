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
  active: boolean;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, never, Date | string>;
}

export type AccountUserJWT = Awaited<ReturnType<ReturnType<typeof AccountUserRepo>['loginByEmail']>>;

export function AccountUserRepo() {
  const space: keyof Database = 'account.user';
  return {
    async exists(email: string) {
      const { rows } = await sql<{
        exists: boolean;
      }>`SELECT EXISTS (SELECT FROM "account"."user" WHERE "email" = ${email})`.execute(db);

      return rows[0].exists;
    },
    async getById(id: number) {
      return db.selectFrom(space).where('account.user.id', '=', id).execute();
    },
    async loginByEmail(email: string, password: string) {
      return db
        .selectFrom(space)
        .select([
          'account.user.id',
          'account.user.email',
          'account.user.first_name',
          'account.user.last_name',
          'account.user.city',
          'account.user.country',
          'account.user.street',
          'account.user.zip_code',
          'account.user.active',
        ])
        .where('account.user.email', '=', email)
        .where('account.user.password', '=', sql`crypt(${password}, account.user.password)`)
        .where('account.user.active', '=', true)
        .executeTakeFirstOrThrow();
    },
    async create(user: Omit<AccountUserTable, 'id' | 'created_at' | 'updated_at' | 'active'>) {
      return db
        .insertInto(space)
        .values({ ...user, password: sql`crypt(${user.password}, gen_salt('bf'))`, active: false })
        .execute();
    },
    async activate(email: string) {
      return db.updateTable(space).set({ active: true }).where('email', '=', email).execute();
    },
  };
}

export default AccountUserRepo();
