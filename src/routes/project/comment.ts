import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import schema from 'schema';
import { LinkResponseType, createResponse } from 'utils/response';
import project_comment_service from 'services/project-comment';
import { StatusCodes } from 'http-status-codes';
import { isAllowedProject } from 'middleware/allowed';

const _links: LinkResponseType = [
  {
    rel: 'self',
    href: '/project/:project_id/task/:task_id/comment/',
    method: 'GET',
  },
  {
    rel: 'create',
    href: '/project/:project_id/task/:task_id/comment/',
    method: 'POST',
  },
  {
    rel: 'delete',
    href: '/project/:project_id/task/:task_id/comment/:comment_id',
    method: 'DELETE',
  },
];

const ProjectCommentRouter: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  fastify.post(
    '/:project_id/task/:task_id/comment',
    {
      schema: schema.project_comment.create,
      preHandler: isAllowedProject({ as_owner: false, project: { from: 'params', name: 'project_id' } }),
    },
    async (req, res) => {
      //@ts-ignore
      await project_comment_service.create(req.params.task_id, req.session.id, req.body.content);

      return res.status(StatusCodes.CREATED).send(createResponse({}, _links));
    }
  );

  fastify.get(
    '/:project_id/task/:task_id/comment',
    {
      schema: schema.project_comment.get_list,
      preHandler: isAllowedProject({ as_owner: false, project: { from: 'params', name: 'project_id' } }),
    },
    async (req, res) => {
      //@ts-ignore
      const comment_list = await project_comment_service.getCommentList(req.params.task_id);

      return res.status(StatusCodes.OK).send(createResponse({ comment_list }, _links));
    }
  );

  fastify.delete(
    '/:project_id/task/:task_id/comment/:comment_id',
    {
      schema: schema.project_comment.delete,
      preHandler: isAllowedProject({ as_owner: false, project: { from: 'params', name: 'project_id' } }),
    },
    async (req, res) => {
      //@ts-ignore
      await project_comment_service.deleteByCommentId(req.params.comment_id);

      return res.status(StatusCodes.OK).send(createResponse({}, _links));
    }
  );
};

export default ProjectCommentRouter;
