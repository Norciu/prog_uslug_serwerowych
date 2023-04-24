//@ts-ignore
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import config from './config';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Database {

}

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
