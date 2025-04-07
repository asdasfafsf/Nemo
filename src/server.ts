import Fastify from 'fastify';
import env from './config/env';
import { RESPONSE_PAIR } from './constants/common';
import { loadScript, runScript } from './script/loader';
import typia from 'typia';
import { Request } from './types/common';
import { NemoError } from './errors/NemoError';

const fastify = Fastify();

fastify.setNotFoundHandler(async (request, reply) => {
  return reply.code(404)
    .send({
        ...RESPONSE_PAIR.CLIENT_ERROR
    });
});


fastify.get('/health', async (request, reply) => {
  return reply
    .code(200)
    .send({
        ...RESPONSE_PAIR.SUCCESS
    });
});


fastify.post('/execute', async (request, reply) => {
  try {
    if (typia.is<Request<any>>(request.body)) { 
        await loadScript(request.body);
        const response = await runScript(request.body);
        return reply
            .code(200)
        .send(response);
    } else {
        return reply
            .code(400)
            .send({
                ...RESPONSE_PAIR.INVALID_PARAMETERS
            });
    }
  } catch (error) {
    if (error instanceof NemoError) {
        return reply
            .code(200)
            .send({
                code: error.code,
                message: error.message,
                techMessage: error.techMessage,
                data: null
            });
    }
    return reply
        .code(200)
        .send({
            ...RESPONSE_PAIR.ERROR
        });
  }
});

fastify.listen({ port: env.serverPort, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
