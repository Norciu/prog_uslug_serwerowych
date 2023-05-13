import { Kysely, sql } from 'kysely';
import { Database } from 'db/db.type';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.createSchema('account').execute();
  await db.schema.withSchema('account').createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('email', 'varchar(255)', (col) => col.unique())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('first_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('country', 'varchar(255)', (col) => col.notNull())
    .addColumn('city', 'varchar(255)', (col) => col.notNull())
    .addColumn('street', 'varchar(255)', (col) => col.notNull())
    .addColumn('zip_code', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.withSchema('account').dropTable('user').execute();
  await db.schema.dropSchema('account').execute();
}
