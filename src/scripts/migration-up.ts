import path from 'path';
import { Pool } from 'pg';
import fs from 'fs/promises';
import {
  Kysely, Migrator, PostgresDialect, FileMigrationProvider, LogEvent,
} from 'kysely';
import { Database } from 'db/db.type';
import config from 'utils/config';
import format from 'db/formatter';

async function migrateUp() {
  const db = new Kysely<Database>({
    log(event: LogEvent) {
      if (event.level === 'query' && config.sql_debug) {
        console.log(format(event.query.sql, event.query.parameters));
      }
    },
    dialect: new PostgresDialect({
      pool: new Pool({
        host: config.postgres.host,
        database: config.postgres.database,
        user: config.postgres.username,
        password: config.postgres.password,
        port: Number(config.postgres.port),
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '..', 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateUp();
