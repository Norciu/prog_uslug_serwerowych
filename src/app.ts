import fastify from 'fastify';
import Router from 'routes';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => void;
  }
  interface FastifyRequest {
    user: any;
  }
}

export default async function App() {
  const app = fastify({ logger: true });

  await app.register(import('./middleware/jwt'));

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

  return app;
}
