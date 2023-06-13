export default {
  register: {
    auth: false,
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
    response: {
      201: {
        type: 'object',
        properties: {
          code: { type: 'string' },
        },
      },
      400: {
        type: 'string',
        value: 'Nie można utworzyć użytkownika',
      },
    },
  },
  register_confirm: {
    auth: false,
    body: {
      type: 'object',
      properties: {
        code: { type: 'string' },
      },
      required: ['code'],
    },
    response: {
      200: {
        type: 'string',
        value: 'Aktywowano użytkownika',
      },
      404: {
        type: 'string',
        value: 'Kod nie istnieje lub wygasł',
      },
    },
  },
  login: {
    auth: false,
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
      additionalProperties: false,
    },
    response: {
      200: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
      401: {
        type: 'string',
        value: 'Błędne dane uwierzytelniające',
      },
    },
  },
  refresh_token: {
    auth: false,
    body: {
      type: 'object',
      properties: {
        refresh_token: { type: 'string' },
      },
      required: ['refresh_token'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
      401: {
        type: 'string',
        value: 'Błędny lub przedawniony token',
      },
    },
  },
} as const;
