import path from 'path';
import { Pool } from 'pg';
import fs from 'fs/promises';
import {
  Kysely, Migrator, PostgresDialect, FileMigrationProvider,
} from 'kysely';
import { Database } from 'db/db.type';
import config from 'utils/config';
import format from 'db/formatter';

async function migrationDown() {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: config.postgres.host,
        database: config.postgres.database,
        user: config.postgres.username,
        password: config.postgres.password,
        port: Number(config.postgres.port),
      }),
    }),
    log(event) {
      if (event.level === 'query' && config.sql_debug) {
        console.log(format(event.query.sql, event.query.parameters));
      }
    },
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '..', 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.info(`migration down "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration down "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate down');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrationDown();
