import authService from 'services/auth';
import { StatusCodes } from 'http-status-codes';
import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import schema from 'schema';

// Prefix /api/auth
const AuthRouter: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  fastify.post(
    '/registration',
    {
      schema: schema.auth.register,
    },
    async (req, res) => {
      try {
        const code = await authService.registerCache(req.body);
        return await res.code(StatusCodes.CREATED).send({ code });
      } catch (e) {
        return res.code(StatusCodes.BAD_REQUEST).send('Nie można utworzyć użytkownika');
      }
    }
  );

  fastify.post(
    '/registration/confirm',
    {
      schema: schema.auth.register_confirm,
    },
    async (req, res) => {
      try {
        await authService.validateRegisterCache(req.body.code);
        return await res.code(StatusCodes.OK).send('Aktywowano użytkownika');
      } catch (e) {
        return res.code(StatusCodes.NOT_FOUND).send('Kod nie istnieje lub wygasł');
      }
    }
  );

  fastify.post(
    '/login',
    {
      schema: schema.auth.login,
    },
    async (req, res) => {
      try {
        const { token: accessToken, refresh_token: refreshToken } = await authService.login(
          req.body.email,
          req.body.password
        );
        return await res.code(StatusCodes.OK).send({ accessToken, refreshToken });
      } catch (e) {
        return res.code(StatusCodes.UNAUTHORIZED).send('Błędne dane uwierzytelniające');
      }
    }
  );

  fastify.post(
    '/refresh',
    {
      schema: schema.auth.refresh_token,
    },
    async (req, res) => {
      try {
        const { refresh_token: old_refresh_token } = req.body;
        const { token: accessToken, refresh_token: refreshToken } = await authService.refreshToken(old_refresh_token);
        return await res.code(StatusCodes.OK).send({ accessToken, refreshToken });
      } catch (e) {
        return res.code(StatusCodes.UNAUTHORIZED).send('Błędny lub przedawniony token');
      }
    }
  );
};

export default AuthRouter;
