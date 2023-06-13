import { AccountUserTable } from 'db/models/account-user';
import { AccountProjectTable } from './models/account-project';
import { AccountProjectMemberTable } from './models/account-project-member';
import { AccountProjectTask } from './models/account-project-task';
import { AccountProjectCommentTable } from './models/account-project-comment';

interface Views {}

interface Tables {
  'account.user': AccountUserTable;
  'account.project': AccountProjectTable;
  'account.project_member': AccountProjectMemberTable;
  'account.project_task': AccountProjectTask;
  'account.project_comment': AccountProjectCommentTable;
}

export type Database = Views & Tables;
