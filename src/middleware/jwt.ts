import { AccountUserJWT } from 'db/models/account-user';
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import * as jose from 'jose';
import config from 'utils/config';

const secret = new TextEncoder().encode(config.jwt_secret);

export async function verifyJWT(jwt_token: string) {
  return jose.jwtVerify(jwt_token, secret);
}

export async function signJWT(payload: AccountUserJWT) {
  const token_instance = new jose.SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setIssuedAt();

  const [token, refresh_token] = await Promise.all([
    token_instance.setExpirationTime('10h').sign(secret),
    token_instance.setExpirationTime('1h').sign(secret),
  ]);

  return {
    type: 'Bearer',
    payload,
    token,
    refresh_token,
  };
}

export const handleSession: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorateRequest('session', null);

  fastify.addHook('onRequest', async (req: FastifyRequest, res: FastifyReply) => {
    if (!req.routeSchema?.auth) {
      return;
    }
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }

    try {
      const user = await verifyJWT(token);
      req.session = user.payload as AccountUserJWT;
    } catch (e) {
      return res.status(StatusCodes.UNAUTHORIZED).send(ReasonPhrases.UNAUTHORIZED);
    }
  });
});

export default handleSession;
