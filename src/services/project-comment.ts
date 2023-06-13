import { AccountProjectCommentRepo } from 'db/models/account-project-comment';

export function ProjectCommentService() {
  const comment_repo = AccountProjectCommentRepo();

  return {
    async create(task_id: number, user_id: number, content: string) {
      return comment_repo.create(task_id, user_id, content);
    },
    async deleteByCommentId(comment_id: number) {
      return comment_repo.deleteByCommentId(comment_id);
    },
    async getCommentList(task_id: number) {
      return comment_repo.getCommentList(task_id);
    },
  };
}

export default ProjectCommentService();
