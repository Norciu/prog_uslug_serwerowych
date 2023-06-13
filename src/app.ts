import fastify from 'fastify';
import { writeFileSync } from 'fs';
import Router from 'routes';
import handleSession from 'middleware/jwt';
import { AccountUserJWT } from 'db/models/account-user';

declare module 'fastify' {
  interface FastifyInstance {
    handleSession: () => Promise<void>;
  }
  interface FastifyRequest {
    session: AccountUserJWT;
  }

  interface FastifySchema {
    auth: boolean;
  }
}

export default async function App() {
  const app = fastify({ logger: true });

  await app.register(handleSession);

  await app.register(import('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'API Programowanie usług serwerowych',
        description: 'API Programowanie usług serwerowych',
        version: '1.0.0',
      },
    },
  });

  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/api/docs',
    staticCSP: true,
  });

  await app.register(Router);

  const swagger = app.swagger();
  writeFileSync('./swagger.json', JSON.stringify(swagger, null, 2));

  return app;
}
