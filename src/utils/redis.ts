import IORedis from 'ioredis';
import config from './config';

export function Redis() {
  const redis = new IORedis(config.redis_url);
  redis.on('error', (err) => {
    throw err;
  });
  return redis;
}
export default Redis();
