import { StatusCodes } from 'http-status-codes';
import check from 'utils/status-checker';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const Router: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  fastify.get('/health', async (request, response) => {
    const [postgres, redis, mongo, rabbitmq] = await Promise.all([
      check.postgres(),
      check.redis(),
      check.mongo(),
      check.rabbitmq(),
    ]);

    const status = {
      postgres, redis, mongo, rabbitmq,
    };

    if (Object.values(status).some((value) => value === 'error')) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(status);
    }

    return response.status(StatusCodes.OK).send(status);
  });

  // Register routes
  fastify.register(import('./auth'), { prefix: '/auth' });
};

export default Router;
