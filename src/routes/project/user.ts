import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { isAllowedProject } from 'middleware/allowed';
import schema from 'schema';
import { ProjectUserService } from 'services/project-user';
import { LinkResponseType, createResponse } from 'utils/response';

const _links: LinkResponseType = [
  {
    rel: 'add',
    href: '/project/:project_id/user/add',
    method: 'POST',
  },
  {
    rel: 'list',
    href: '/project/:project_id/user/list',
    method: 'GET',
  },
  {
    rel: 'delete',
    href: '/project/:project_id/user/delete',
    method: 'DELETE',
  },
];

// Prefix: /project/user
const ProjectUserRouter: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const project_user_service = ProjectUserService();

  fastify.post(
    '/:project_id/user/add',
    {
      schema: schema.project_user.add,
      preHandler: isAllowedProject({ as_owner: true, project: { from: 'params', name: 'project_id' } }),
    },
    async (req, res) => {
      try {
        //@ts-ignore
        await project_user_service.add(req.params.project_id, req.body.user_id);
        return res.status(StatusCodes.OK).send(createResponse({}, _links));
      } catch (e) {}
    }
  );

  fastify.get('/:project_id/user/list', { schema: schema.project_user.get }, async (req, res) => {
    const users = await project_user_service.get(req.params.project_id);

    return res.status(StatusCodes.OK).send(createResponse({ users }, _links));
  });

  fastify.delete(
    '/:project_id/user/delete',
    {
      schema: schema.project_user.delete,
      preValidation: isAllowedProject({ as_owner: true, project: { from: 'params', name: 'project_id' } }),
    },
    async (req, res) => {
      //@ts-ignore
      await project_user_service.delete(req.params.project_id, req.body.user_id);
      return res.status(StatusCodes.OK).send(createResponse({}, _links));
    }
  );
};

export default ProjectUserRouter;
