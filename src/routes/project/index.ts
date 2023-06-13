import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { isAllowedProject } from 'middleware/allowed';
import schema from 'schema';
import { ProjectService } from 'services/project';
import { LinkResponseType, createResponse } from 'utils/response';

const lists: LinkResponseType = [
  { rel: 'self', href: '/api/project', method: 'POST' },
  { rel: 'self', href: '/api/project', method: 'GET' },
  { rel: 'self', href: '/api/project/:id', method: 'GET' },
  { rel: 'self', href: '/api/project/:id', method: 'PUT' },
  { rel: 'self', href: '/api/project/:id', method: 'DELETE' },
];

// Prefix /api/project
const ProjectRouter: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  const project_service = ProjectService();

  fastify.post('/', { schema: schema.project.create }, async (req, res) => {
    const id = await project_service.create(req.session.id, req.body);

    return res.status(201).send(createResponse({ id }, lists));
  });

  fastify.get(
    '/:id?',
    {
      schema: schema.project.list,
      preHandler: isAllowedProject({ as_owner: false, project: { from: 'params', name: 'id' } }),
    },
    async (req, res) => {
      const projects = await project_service.list(req.session.id);

      return res.status(StatusCodes.OK).send(createResponse({ projects }, lists));
    }
  );

  fastify.put(
    '/:id',
    {
      schema: schema.project.update,
      preHandler: isAllowedProject({ as_owner: true, project: { from: 'params', name: 'id' } }),
    },
    async (req, res) => {
      //@ts-ignore
      await project_service.update(req.params.id, req.body);

      return res.status(StatusCodes.OK).send(createResponse({}, lists));
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: schema.project.delete,
      preHandler: isAllowedProject({ as_owner: true, project: { from: 'params', name: 'id' } }),
    },
    async (req, res) => {
      //@ts-ignore
      await project_service.delete(req.params.id);

      return res.status(StatusCodes.OK).send(createResponse({}, lists));
    }
  );
};

export default ProjectRouter;
