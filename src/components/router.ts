import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { FastifyInstance } from 'fastify';
import check from 'utils/status-checker';

export default async function Router(fastify: FastifyInstance) {
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

    if (Object.values(status).some((value) => value === ReasonPhrases.INTERNAL_SERVER_ERROR)) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(status);
    }

    return response.status(StatusCodes.OK).send(status);
  });
}
