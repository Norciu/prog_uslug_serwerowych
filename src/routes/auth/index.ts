import validator from 'validator';
import authService from 'services/auth';
import { StatusCodes } from 'http-status-codes';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { Transform } from 'utils';

// Prefix /api/auth
const AuthRouter: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  fastify.route({
    method: 'POST',
    url: '/registration',
    schema: {
      body: validator.auth.register.body,
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
    handler: async (req, res) => {
      try {
        const code = await authService.registerCache(req.body);
        return await res.code(StatusCodes.CREATED).send({ code });
      } catch (e) {
        return res.code(StatusCodes.BAD_REQUEST).send('Nie można utworzyć użytkownika');
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/registration/confirm',
    schema: {
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
    } as const,
    handler: async (req, res) => {
      try {
        await authService.validateRegisterCache(req.body.code);
        return await res.code(StatusCodes.OK).send('Aktywowano użytkownika');
      } catch (e) {
        return res.code(StatusCodes.NOT_FOUND).send('Kod nie istnieje lub wygasł');
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      body: validator.auth.login.body,
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
    handler: async (req, res) => {
      try {
        const {
          token: accessToken,
          refresh_token: refreshToken,
        } = await authService.login(req.body.email, req.body.password);
        return await res.code(StatusCodes.OK).send({ accessToken, refreshToken });
      } catch (e) {
        return res.code(StatusCodes.UNAUTHORIZED).send('Błędne dane uwierzytelniające');
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/refresh',
    schema: {
      body: validator.auth.refresh_token.body,
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
    async handler(req, res) {
      try {
        const { refresh_token: old_refresh_token } = req.body;
        const { token: accessToken, refresh_token: refreshToken } = await authService.refreshToken(old_refresh_token);
        return await res.code(StatusCodes.OK).send({ accessToken, refreshToken });
      } catch (e) {
        return res.code(StatusCodes.UNAUTHORIZED).send('Błędny lub przedawniony token');
      }
    },
  });
};

export default AuthRouter;
