import { AccountProjectTask, AccountProjectTaskRepo } from 'db/models/account-project-task';

export function ProjectTaskService() {
  const project_task_repo = AccountProjectTaskRepo();

  return {
    async create(task: Omit<AccountProjectTask, 'id'>) {
      return project_task_repo.create(task);
    },
    async get(project_id: number, task_id?: number) {
      return project_task_repo.get(project_id, task_id);
    },
    async update(project_id: number, task_id: number, task: Partial<AccountProjectTask>) {
      return project_task_repo.update(project_id, task_id, task);
    },
    async delete(project_id: number, task_id: number) {
      return project_task_repo.delete(project_id, task_id);
    },
  };
}
