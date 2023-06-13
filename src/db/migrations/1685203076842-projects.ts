import { Kysely, sql } from 'kysely';
import { Database } from 'db/db.type';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.withSchema('account').createType('project_role_enum').asEnum(['user', 'owner']).execute();

  await db.schema
    .withSchema('account')
    .createTable('project')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('owner_id', 'integer', (col) => col.references('account.user.id').notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('start_date', 'date', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('estimated_end_date', 'date', (col) => col.notNull())
    .addColumn('end_date', 'date')
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .withSchema('account')
    .createTable('project_member')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('project_id', 'integer', (col) => col.references('account.project.id').notNull())
    .addColumn('user_id', 'integer', (col) => col.references('account.user.id').notNull().unique())
    .addColumn('role', sql`account.project_role_enum`, (col) => col.notNull().defaultTo('user'))
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .withSchema('account')
    .createTable('project_task')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('project_id', 'integer', (col) => col.references('account.project.id').notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('priority', 'int2', (col) =>
      col
        .notNull()
        .defaultTo(1)
        .check(sql`priority >= 1 AND priority <= 5`)
    )
    .addColumn('estimated_end_date', 'date', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema
    .withSchema('account')
    .createTable('project_comment')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('task_id', 'integer', (col) => col.references('account.project_task.id').notNull())
    .addColumn('user_id', 'integer', (col) => col.references('account.user.id').notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.withSchema('account').dropTable('project_comment').execute();
  await db.schema.withSchema('account').dropTable('project_task').execute();
  await db.schema.withSchema('account').dropTable('project_member').execute();
  await db.schema.withSchema('account').dropTable('project').execute();
  await db.schema.withSchema('account').dropType('project_role_enum').execute();
}
