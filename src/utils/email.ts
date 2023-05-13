import accountUser from 'db/models/account-user';

function Email(email: string) {
  return {
    async existsInDatabase() {
      return accountUser.exists(email);
    },
  };
}

export default Email;
