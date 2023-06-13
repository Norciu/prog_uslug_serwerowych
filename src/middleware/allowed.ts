import { preHandlerAsyncHookHandler } from 'fastify';
import project_member_repo from 'db/models/account-project-member';

interface Project {
  as_owner: boolean;
  project: {
    from: 'body' | 'params' | 'query';
    name: string;
  };
}

export function isAllowedProject(opts: Project): preHandlerAsyncHookHandler {
  return async function (req, res) {
    //@ts-ignore
    const project_id = req[opts.project.from][opts.project.name];
    if (!project_id) {
      return;
    }
    const allowed = await project_member_repo.isAllowed({
      user_id: req.session.id,
      project_id,
      as_owner: opts.as_owner,
    });

    if (!allowed) {
      return res.status(403).send({ message: 'Forbidden' });
    }
  };
}
