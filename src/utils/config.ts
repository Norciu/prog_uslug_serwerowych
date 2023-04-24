import 'dotenv/config';

interface GetEnvOpts {
  default?: string;
}

function getEnv(name: string, opts?: GetEnvOpts) {
  const env = process.env[name] || opts?.default;
  if (!env) {
    throw new Error(`Missing env variable: ${name}`);
  }

  return env;
}

export default {
  api_port: Number(getEnv('API_PORT', { default: '8000' })),
  postgres: {
    host: getEnv('POSTGRES_HOST', { default: 'localhost' }),
    port: getEnv('POSTGRES_PORT', { default: '5432' }),
    username: getEnv('POSTGRES_USERNAME', { default: 'postgres' }),
    password: getEnv('POSTGRES_PASSWORD', { default: 'postgres' }),
    database: getEnv('POSTGRES_DATABASE', { default: 'postgres' }),
  },
  mongo_url: getEnv('MONGO_URL', { default: 'mongodb://localhost:27017' }),
  redis_url: getEnv('REDIS_URL', { default: 'redis://localhost:6379' }),
  rabbitmq_url: getEnv('RABBITMQ_URL', { default: 'amqp://localhost:5672' }),
};
