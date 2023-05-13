// @ts-ignore
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import config from '../utils/config';
import { Database } from './db.type';

export default new Kysely<Database>({
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
