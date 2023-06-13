export default {
  add: {
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
        user_id: { type: 'number' },
      },
      required: ['user_id'],
    },
  },
  get: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
      },
      required: ['project_id'],
    },
  },
  delete: {
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
        user_id: { type: 'number' },
      },
      required: ['user_id'],
    },
  },
} as const;
