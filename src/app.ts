import fastify from 'fastify';
import Router from 'routes';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';

const app = fastify({ logger: true }).withTypeProvider<JsonSchemaToTsProvider>();
export type AppInstance = typeof app;

export default async function App() {
  await app.register(Router, { prefix: '/api' });

  return app;
}
