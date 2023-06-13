type PropertiesType =
  | Record<string, { type: 'string' | 'number' | 'boolean' | 'array' }>
  | Record<string, { type: 'array'; items: Record<string, unknown> }>;

export function createResponseSchema(properties: PropertiesType) {
  return {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties,
      },
      _links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ref: { type: 'string' },
            href: { type: 'string' },
            method: { type: 'string' },
          },
        },
      },
    },
  };
}
