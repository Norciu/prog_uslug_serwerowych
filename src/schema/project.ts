import { FromSchema } from 'json-schema-to-ts';
import { createResponseSchema } from './createResponseSchema';

const schema = {
  create: {
    auth: true,
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        start_date: { type: 'string' },
        estimated_end_date: { type: 'string' },
        end_date: { type: 'string' },
      },
      required: ['name', 'description', 'end_date'],
    },
    response: {
      201: createResponseSchema({ id: { type: 'number' } }),
    },
  },
  list: {
    auth: true,
    params: {
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'number' },
      },
    },
    response: {
      200: createResponseSchema({
        projects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              start_date: { type: 'string' },
              end_date: { type: 'string' },
              role: { type: 'string' },
            },
          },
        },
      }),
    },
  },
  update: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      additionalProperties: false,
      required: ['id'],
    },
    body: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        start_date: { type: 'string' },
        estimated_end_date: { type: 'string' },
        end_date: { type: 'string' },
      },
    },
    response: {
      200: createResponseSchema({}),
    },
  },
  delete: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
      additionalProperties: false,
      required: ['id'],
    },
    response: {
      200: createResponseSchema({}),
    },
  },
} as const;

export default schema;

export type ProjectCreateSchema = FromSchema<typeof schema.create.body>;
export type ProjectUpdateSchema = FromSchema<typeof schema.update.body>;
