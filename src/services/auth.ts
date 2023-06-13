import { FromSchema } from 'json-schema-to-ts';
import redis from 'utils/redis';
import { generatePin } from 'utils';
import Email from 'utils/email';
import accountUserRepo, { AccountUserJWT } from 'db/models/account-user';
import { signJWT, verifyJWT } from 'middleware/jwt';
import schema from 'schema';

type UserRegister = FromSchema<typeof schema.auth.register.body>;

function AuthService() {
  const register_cache = redis.getCache('register');

  return {
    async registerCache(user: UserRegister) {
      const email = Email(user.email);
      if (await email.existsInDatabase()) {
        throw new Error('Email already exists');
      }
      const pin = generatePin();
      await Promise.all([
        accountUserRepo.create(user),
        register_cache.set(pin, user.email, 600), // 10 minutes
      ]);
      return pin;
    },
    async validateRegisterCache(pin: string) {
      const email = await register_cache.get<string>(pin);
      if (!email) {
        throw new Error('Invalid pin');
      }
      await Promise.all([accountUserRepo.activate(email), register_cache.del(pin)]);
    },
    async login(email: string, password: string) {
      const user = await accountUserRepo.loginByEmail(email, password);
      return signJWT(user);
    },
    async refreshToken(refresh_token: string) {
      const { iss, sub, aud, exp, nbf, iat, jti, ...user } = (await verifyJWT(refresh_token)).payload;
      return signJWT(user as AccountUserJWT);
    },
  };
}

export default AuthService();
