import IORedis from 'ioredis';
import config from './config';

type RedisValue = Record<string | number | symbol, unknown> | string | number | Buffer;

export function Redis(uri = config.redis_url) {
  const redis = new IORedis(uri);

  return {
    getCache(prefix?: string) {
      const k = (key: string) => (prefix ? `${prefix}:${key}` : key);
      return {
        async set(key: string, value: RedisValue, expire?: number) {
          const val = typeof value === 'object' ? JSON.stringify(value) : value;
          if (expire) {
            return redis.set(k(key), val, 'EX', expire);
          }
          return redis.set(k(key), val);
        },
        async get<T>(key: string) {
          const val = await redis.get(k(key));
          if (!val) {
            return null;
          }
          if (typeof val !== 'string') {
            return val as unknown as T;
          }
          try {
            const parsed = JSON.parse(val) as T;
            return parsed;
          } catch (e) {
            return val as unknown as T;
          }
        },
        async del(key: string) {
          return redis.del(k(key));
        },
      };
    },
    status() {
      return redis.status;
    },
    destroy() {
      return redis.quit();
    },
  };
}

export default Redis();
