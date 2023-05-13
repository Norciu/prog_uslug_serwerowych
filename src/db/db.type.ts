import { AccountUserTable } from 'db/models/account-user';

interface Views {}

interface Tables {
  'account.user': AccountUserTable;
}

export type Database = Views & Tables;
