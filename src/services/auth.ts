import { FromSchema } from 'json-schema-to-ts';
import redis from 'utils/redis';
import { generatePin } from 'utils';
import validator from 'validator';
import Email from 'utils/email';
import accountUserRepo from 'db/models/account-user';

type UserRegister = FromSchema<typeof validator.auth.register.body>;

function AuthService() {
  const register_cache = redis.getCache('register');

  return {
    async registerCache(user: UserRegister) {
      const email = Email(user.email);
      if (await email.existsInDatabase()) {
        throw new Error('Email already exists');
      }
      const pin = generatePin();
      await register_cache.set(`${user.email}:${pin}`, user, 600); // 10 minutes
      return pin;
    },
    async validateRegisterCache(email: string, pin: string) {
      const cache = await register_cache.get<UserRegister>(`${email}:${pin}`);
      if (!cache) {
        return false;
      }
      await register_cache.del(`${email}:${pin}`);
      await accountUserRepo.create(cache);

      return true;
    },
  };
}

export default AuthService();
