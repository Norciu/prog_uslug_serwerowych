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
    },
    login: {
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['email', 'password'],
        additionalProperties: false,
      },
    },
    refresh_token: {
      body: {
        type: 'object',
        properties: {
          refresh_token: { type: 'string' },
        },
        required: ['refresh_token'],
      },
    },
  },
} as const;

export default validator;
