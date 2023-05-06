import fastify from 'fastify';
import type { FastifyZod } from 'fastify-zod';
import { buildJsonSchemas, register } from 'fastify-zod';
import validator from 'validator';
import Router from 'components/router';

declare module 'fastify' {
  //@ts-ignore
  interface FastifyInstance {
    readonly zod: FastifyZod<typeof validator>;
  }
}

export default async function App() {
  const app = await register(
    fastify({ logger: true }),
    { jsonSchemas: buildJsonSchemas(validator) },
  );
  await app.register(Router);

  return app;
}
