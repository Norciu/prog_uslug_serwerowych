import { FromSchema } from 'json-schema-to-ts';

export type ValidatorType = {
  auth: {
    register: {
      body: FromSchema<typeof validator.auth.register.body>;
    }
  }
};

const validator = {
  auth: {
    register: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          country: { type: 'string' },
          city: { type: 'string' },
          street: { type: 'string' },
          zip_code: { type: 'string' },
        },
        required: ['email', 'password', 'first_name', 'last_name', 'country', 'city', 'street', 'zip_code'],
        additionalProperties: false,
      },
    } as const,
    register_confirm: {
      querystring: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          pin: { type: 'string' },
        },
        required: ['email', 'pin'],
        additionalProperties: false,
      },
    } as const,
  },
};

export default validator;
