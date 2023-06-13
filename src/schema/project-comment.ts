export default {
  create: {
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
        content: { type: 'string' },
      },
      required: ['content'],
    },
  },
  get_list: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
        task_id: { type: 'number' },
      },
      required: ['project_id', 'task_id'],
    },
  },
  delete: {
    auth: true,
    params: {
      type: 'object',
      properties: {
        project_id: { type: 'number' },
        task_id: { type: 'number' },
        comment_id: { type: 'number' },
      },
      required: ['project_id', 'task_id', 'comment_id'],
    },
  },
} as const;
