import db from 'db';
import { Database } from 'db/db.type';
import { ColumnType, Generated, sql } from 'kysely';

export interface AccountProjectCommentTable {
  id: Generated<number>;
  task_id: number;
  user_id: number;
  content: string;
  created_at: ColumnType<string, string | undefined, never>;
}

export function AccountProjectCommentRepo() {
  const space: keyof Database = 'account.project_comment';

  return {
    async create(task_id: number, user_id: number, content: string) {
      return db
        .insertInto(space)
        .values({ task_id, user_id, content })
        .returning('account.project_comment.id')
        .execute();
    },
    async deleteByCommentId(comment_id: number) {
      return db.deleteFrom(space).where('account.project_comment.id', '=', comment_id).execute();
    },
    async getCommentList(task_id: number) {
      return db
        .selectFrom(space)
        .select(sql`row_to_json(account.project_comment.*)`.as('comment'))
        .select(sql`row_to_json(account.user.*)`.as('user'))
        .innerJoin('account.user', 'account.user.id', 'account.project_comment.user_id')
        .where('account.project_comment.task_id', '=', task_id)
        .orderBy('account.project_comment.created_at', 'asc')
        .execute();
    },
  };
}
