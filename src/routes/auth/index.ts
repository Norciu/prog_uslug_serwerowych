import { AppInstance } from 'app';
import validator from 'validator';
import authService from 'services/auth';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// Prefix /api/auth
async function AuthRouter(fastify: AppInstance) {
  fastify.route({
    method: 'POST',
    url: '/registration',
    schema: validator.auth.register,
    handler: async (req, res) => {
      try {
        const pin = await authService.registerCache(req.body);
        return await res.code(StatusCodes.OK).send({ pin });
      } catch (e) {
        if (e instanceof Error && e.message === 'Email already exists') {
          return res.code(StatusCodes.CONFLICT).send(ReasonPhrases.CONFLICT);
        }
        return res.code(StatusCodes.INTERNAL_SERVER_ERROR)
          .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/registration/confirm',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          pin: { type: 'string' },
        },
        required: ['email', 'pin'],
      },
    } as const,
    handler: async (req, res) => {
      const t = await authService.validateRegisterCache(req.query.email, req.query.pin);
      if (!t) {
        return res.code(StatusCodes.BAD_REQUEST).send(ReasonPhrases.BAD_REQUEST);
      }

      return res.code(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
    },
  });
}

export default AuthRouter;
