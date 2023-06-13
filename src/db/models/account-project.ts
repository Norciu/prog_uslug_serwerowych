import db from 'db';
import { Database } from 'db/db.type';
import { ColumnType, Generated, sql } from 'kysely';
import { ProjectCreateSchema } from 'schema/project';
import { PROJECT_ROLE_ENUM } from './account-project-member';

export interface AccountProjectTable {
  id: Generated<number>;
  owner_id: ColumnType<number, number, never>;
  name: string;
  description: string;
  start_date: ColumnType<string, never, never>;
  estimated_end_date: ColumnType<string, never, never>;
  end_date: ColumnType<string, never, Date | string>;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, never, Date | string>;
}

export function AccountProjectRepo() {
  const space: keyof Database = 'account.project';
  return {
    async update(id: number, data: Partial<ProjectCreateSchema>) {
      return db.updateTable(space).set(data).where('account.project.id', '=', id).execute();
    },
    async list(user_id: number, project_id?: number) {
      return db
        .selectFrom('account.project_member')
        .innerJoin('account.project', (join) =>
          join
            .onRef('account.project_member.project_id', '=', 'account.project.id')
            .on('account.project_member.user_id', '=', user_id)
        )
        .select([
          'account.project.id',
          'account.project.name',
          'account.project.description',
          'account.project.start_date',
          'account.project.estimated_end_date',
          'account.project.end_date',
          'account.project_member.role',
        ])
        .$if(!!project_id, (query) => query.where('account.project.id', '=', project_id!))
        .execute();
    },
    async create(owner_id: number, data: ProjectCreateSchema) {
      return db
        .insertInto(space)
        .values({ owner_id, ...data })
        .returning('account.project.id')
        .executeTakeFirstOrThrow();
    },
    async getById(id: number) {
      return db.selectFrom(space).where('account.project.id', '=', id).execute();
    },
    async delete(id: number) {
      return db.deleteFrom(space).where('account.project.id', '=', id).execute();
    },
  };
}
