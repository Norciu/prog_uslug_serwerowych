import { Kysely, sql } from 'kysely';
import { Database } from 'db/db.type';
import { Chance } from 'chance';

const chance = new Chance();

export async function up(db: Kysely<Database>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`.execute(db);
  await db.schema.createSchema('account').ifNotExists().execute();
  await db.schema
    .withSchema('account')
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('email', 'varchar(255)', (col) => col.unique().notNull())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('first_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('country', 'varchar(255)', (col) => col.notNull())
    .addColumn('city', 'varchar(255)', (col) => col.notNull())
    .addColumn('street', 'varchar(255)', (col) => col.notNull())
    .addColumn('zip_code', 'varchar(255)', (col) => col.notNull())
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db
    .insertInto('account.user')
    .values({
      email: 'test@edu.wsti.pl',
      password: sql`crypt('Zaq12wsx#', gen_salt('bf'))`,
      first_name: chance.first(),
      last_name: chance.last(),
      country: chance.country(),
      city: chance.city(),
      street: chance.street(),
      zip_code: chance.zip(),
      active: true,
    })
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.withSchema('account').dropTable('user').execute();
  await db.schema.dropSchema('account').execute();
  await sql`DROP EXTENSION pgcrypto`.execute(db);
}
