import { createResponseSchema } from './createResponseSchema';

export default {
  create: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
      },
      required: ['project_id'],
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'number', minimum: 1, maximum: 5 },
        estimated_end_date: { type: 'string', format: 'date' },
      },
      required: ['name', 'description', 'priority', 'estimated_end_date'],
    },
    response: {
      201: createResponseSchema({ id: { type: 'number' } }),
    },
  },
  get: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
        task_id: { type: 'number' },
      },
      required: ['project_id'],
    },
    response: {
      200: createResponseSchema({
        task: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              project_id: { type: 'number' },
              name: { type: 'string' },
              description: { type: 'string' },
              priority: { type: 'number' },
              estimated_end_date: { type: 'string', format: 'date' },
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
        project_id: { type: 'number' },
        task_id: { type: 'number' },
      },
      required: ['project_id', 'task_id'],
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        priority: { type: 'number', minimum: 1, maximum: 5 },
        estimated_end_date: { type: 'string', format: 'date' },
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
        project_id: { type: 'number' },
        task_id: { type: 'number' },
      },
      required: ['project_id', 'task_id'],
    },
    response: {
      200: createResponseSchema({}),
    },
  },
} as const;
