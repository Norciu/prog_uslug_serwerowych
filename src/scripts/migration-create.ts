#!/usr/bin/env node
import { parseArgs } from 'util';
import { writeFile } from 'fs/promises';

const migrationsFolder = 'src/db/migrations';

const { positionals } = parseArgs({
  allowPositionals: true,
});

async function run() {
  if (positionals.length > 1) {
    throw new Error('Script expects one argument only!');
  }
  const migrationName = positionals[0];
  if (!migrationName) {
    console.log('Usage "npm run migration:create [migration name]');
    throw new Error('Migration name required');
  }
  await writeFile(
    `${migrationsFolder}/${Date.now()}-${migrationName}.ts`,
    `import { Kysely } from 'kysely';
import { Database } from 'db/db.type';

export async function up(db: Kysely<Database>): Promise<void> {
  // migration up code here
}

export async function down(db: Kysely<Database>): Promise<void> {
  // migration up code here
}
`,
  );

  console.log('Migration created: ', `${Date.now()}-migration-${migrationName}.ts`);
}

run();
