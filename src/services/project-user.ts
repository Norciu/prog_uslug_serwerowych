import { AccountProjectMemberRepo } from 'db/models/account-project-member';
import { omit } from 'lodash';

export function ProjectUserService() {
  const project_member_repo = AccountProjectMemberRepo();
  return {
    async add(project_id: number, user_id: number) {
      return project_member_repo.addToProject(project_id, user_id);
    },
    async get(project_id: number) {
      const users = await project_member_repo.getMemberList(project_id);
      return users.map((user) => omit(user, ['password']));
    },
    async delete(project_id: number, user_id: number) {
      return project_member_repo.deleteUserFromProject(project_id, user_id);
    },
  };
}

export default ProjectUserService();
