import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { StatusCodes } from 'http-status-codes';
import schema from 'schema';
import { ProjectTaskService } from 'services/project-task';
import { LinkResponseType, createResponse } from 'utils/response';

const _links: LinkResponseType = [
  {
    rel: 'self',
    href: '/project/:project_id/task',
    method: 'POST',
  },
  {
    rel: 'list',
    href: '/project/:project_id/task/:task_id?',
    method: 'GET',
  },
  {
    rel: 'update',
    href: '/project/:project_id/task/:task_id',
    method: 'PUT',
  },
  {
    rel: 'delete',
    href: '/project/:project_id/task/:task_id',
    method: 'DELETE',
  },
];

// Prefix: /project/task
const ProjectTaskRouter: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const project_task_service = ProjectTaskService();

  fastify.post(
    '/:project_id/task',
    {
      schema: schema.project_task.create,
    },
    async (req, res) => {
      const { id } = await project_task_service.create({ project_id: req.params.project_id, ...req.body });

      return res.status(StatusCodes.CREATED).send(createResponse({ id }, _links));
    }
  );

  fastify.get('/:project_id/task/:task_id?', { schema: schema.project_task.get }, async (req, res) => {
    const task = await project_task_service.get(req.params.project_id, req.params.task_id);

    return res.status(StatusCodes.OK).send(createResponse({ task }, _links));
  });

  fastify.put('/:project_id/task/:task_id', { schema: schema.project_task.update }, async (req, res) => {
    const { id: task_id } = await project_task_service.update(req.params.project_id, req.params.task_id, req.body);

    return res.status(StatusCodes.OK).send(createResponse({ task_id }, _links));
  });

  fastify.delete('/:project_id/task/:task_id', { schema: schema.project_task.delete }, async (req, res) => {
    const { id: task_id } = await project_task_service.delete(req.params.project_id, req.params.task_id);

    return res.status(StatusCodes.OK).send(createResponse({ task_id }, _links));
  });
};

export default ProjectTaskRouter;
