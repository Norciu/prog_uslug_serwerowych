import RabbitMq from 'utils/rabitmq';
import db from 'utils/db';
import redis from 'utils/redis';
import testConnection from 'utils/mongo';
import { ReasonPhrases } from 'http-status-codes';
import { sql } from 'kysely';

function StatusChecker() {
  return {
    async postgres() {
      try {
        await sql`SELECT 1`.execute(db);
        return ReasonPhrases.OK;
      } catch (e) {
        return ReasonPhrases.INTERNAL_SERVER_ERROR;
      }
    },
    async redis() {
      try {
        await redis.set('health', 'ok');
        await redis.del('health');
        return ReasonPhrases.OK;
      } catch (e) {
        return ReasonPhrases.INTERNAL_SERVER_ERROR;
      }
    },
    async mongo() {
      try {
        await testConnection();
        return ReasonPhrases.OK;
      } catch (e) {
        return ReasonPhrases.INTERNAL_SERVER_ERROR;
      }
    },
    async rabbitmq() {
      try {
        await RabbitMq();
        return ReasonPhrases.OK;
      } catch (e) {
        return ReasonPhrases.INTERNAL_SERVER_ERROR;
      }
    },
  };
}

export default StatusChecker();
