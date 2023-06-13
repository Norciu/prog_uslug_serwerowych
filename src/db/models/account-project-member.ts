import db from 'db';
import { Database } from 'db/db.type';
import { ColumnType, Generated, sql } from 'kysely';

export const PROJECT_ROLE_ENUM = {
  USER: 'user',
  OWNER: 'owner',
} as const;

export type RoleColumnType = (typeof PROJECT_ROLE_ENUM)[keyof typeof PROJECT_ROLE_ENUM];

export interface AccountProjectMemberTable {
  id: Generated<number>;
  project_id: number;
  user_id: number;
  role: RoleColumnType;
  created_at: ColumnType<string, string | undefined, never>;
  updated_at: ColumnType<string, never, string>;
}

export function AccountProjectMemberRepo() {
  const space: keyof Database = 'account.project_member';

  return {
    async createOwner(project_id: number, user_id: number) {
      return db
        .insertInto(space)
        .values({ project_id, user_id, role: PROJECT_ROLE_ENUM.OWNER })
        .returning('account.project_member.id')
        .execute();
    },
    async isAllowed(opts: { user_id: number; project_id: number; as_owner: boolean }) {
      const { rows } = await sql<{
        exists: boolean;
      }>`SELECT EXISTS (SELECT FROM "account"."project_member" WHERE "user_id" = ${opts.user_id} AND "project_id" = ${
        opts.project_id
      } ${opts.as_owner ? sql`AND role = ${PROJECT_ROLE_ENUM.OWNER}` : sql``})`.execute(db);

      return rows[0].exists;
    },
    async deleteByProjectId(project_id: number) {
      return db.deleteFrom(space).where('account.project_member.project_id', '=', project_id).execute();
    },
    async addToProject(project_id: number, user_id: number) {
      return db
        .insertInto(space)
        .values({ project_id, user_id, role: PROJECT_ROLE_ENUM.USER })
        .returning('account.project_member.id')
        .execute();
    },
    async getMemberList(project_id: number) {
      return db
        .selectFrom(space)
        .selectAll()
        .innerJoin('account.user', 'account.user.id', 'account.project_member.user_id')
        .where('account.project_member.project_id', '=', project_id)
        .execute();
    },
    async deleteUserFromProject(project_id: number, user_id: number) {
      return db
        .deleteFrom(space)
        .where('account.project_member.project_id', '=', project_id)
        .where('account.project_member.user_id', '=', user_id)
        .execute();
    },
  };
}

export default AccountProjectMemberRepo();
