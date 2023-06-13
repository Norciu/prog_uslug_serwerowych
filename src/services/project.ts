import { AccountProjectRepo } from 'db/models/account-project';
import { AccountProjectMemberRepo } from 'db/models/account-project-member';
import { ProjectCreateSchema, ProjectUpdateSchema } from 'schema/project';

export function ProjectService() {
  const project_repo = AccountProjectRepo();
  const project_member_repo = AccountProjectMemberRepo();
  return {
    async isAllowed(opts: { user_id: number; project_id: number; as_owner: boolean }) {
      return project_member_repo.isAllowed(opts);
    },
    async list(user_id: number, project_id?: number) {
      return project_repo.list(user_id, project_id);
    },
    async getById(id: number) {
      return project_repo.getById(id);
    },
    async create(owner_id: number, data: ProjectCreateSchema) {
      const { id } = await project_repo.create(owner_id, data);
      await project_member_repo.createOwner(id, owner_id);

      return id;
    },
    async update(id: number, data: ProjectUpdateSchema) {
      return project_repo.update(id, data);
    },
    async delete(id: number) {
      await project_member_repo.deleteByProjectId(id);
      await project_repo.delete(id);
    },
  };
}
