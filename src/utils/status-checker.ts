import RabbitMq from 'utils/rabitmq';
import db from 'db';
import redis from 'utils/redis';
import testConnection from 'utils/mongo';
import { sql } from 'kysely';

function StatusChecker() {
  return {
    async postgres() {
      try {
        await sql`SELECT 1`.execute(db);
        return 'ok';
      } catch (e) {
        return 'error';
      }
    },
    async redis() {
      return redis.status() === 'ready' ? 'ok' : 'error';
    },
    async mongo() {
      try {
        await testConnection();
        return 'ok';
      } catch (e) {
        return 'error';
      }
    },
    async rabbitmq() {
      try {
        await RabbitMq();
        return 'ok';
      } catch (e) {
        return 'error';
      }
    },
  };
}

export default StatusChecker();
