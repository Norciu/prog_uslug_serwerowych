import IORedis from 'ioredis';
import config from './config';

export function Redis(uri = config.redis_url) {
  const redis = new IORedis(uri);

  return {
    getCache(prefix?: string) {
      const k = (key: string) => (prefix ? `${prefix}:${key}` : key);
      return {
        async set(key: string, value: string | number | Buffer, expire?: number) {
          if (expire) {
            return redis.set(k(key), value, 'EX', expire);
          }
          return redis.set(k(key), value);
        },
        async hset(key: string, vals: Record<string, unknown>) {
          return redis.hset(k(key), vals);
        },
        async hget(key: string) {
          return redis.hgetall(k(key));
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
