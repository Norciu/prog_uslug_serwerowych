import db from 'db';
import { Database } from 'db/db.type';
import { Generated } from 'kysely';

export interface AccountProjectTask {
  id: Generated<number>;
  project_id: number;
  name: string;
  description: string;
  priority: number;
  estimated_end_date: string;
}

export function AccountProjectTaskRepo() {
  const space: keyof Database = 'account.project_task';

  return {
    async create(task: Omit<AccountProjectTask, 'id'>) {
      return db.insertInto(space).values(task).returning('id').executeTakeFirstOrThrow();
    },
    async get(project_id: number, task_id?: number) {
      return db
        .selectFrom(space)
        .selectAll()
        .where('project_id', '=', project_id)
        .$if(!!task_id, (q) => q.where('id', '=', task_id!))
        .execute();
    },
    async update(project_id: number, task_id: number, task: Partial<Omit<AccountProjectTask, 'id'>>) {
      return db
        .updateTable(space)
        .set(task)
        .where('project_id', '=', project_id)
        .where('id', '=', task_id)
        .returning('id')
        .executeTakeFirstOrThrow();
    },
    async delete(project_id: number, task_id: number) {
      return db
        .deleteFrom(space)
        .where('project_id', '=', project_id)
        .where('id', '=', task_id)
        .returning('id')
        .executeTakeFirstOrThrow();
    },
  };
}
