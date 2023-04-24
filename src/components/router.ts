import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { sql } from 'kysely';
import RabbitMq from '../utils/rabitmq';
import db from '../utils/db';
import redis from '../utils/redis';
import testConnection from '../utils/mongo';

export default async function Router(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.get('/health', async (request, response) => {
    try {
      // Test postgres connection
      await sql`SELECT 1`.execute(db);

      //Test redis connection
      await redis.set('health', 'ok');
      await redis.del('health');

      // Test mongodb connection
      await testConnection();

      //Test rabbitmq connection
      await RabbitMq();
    } catch (e) {
      console.log(e);
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(e);
    }

    return response.status(StatusCodes.OK).send(ReasonPhrases.OK);
  });
}
