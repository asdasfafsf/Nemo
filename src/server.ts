import Fastify from 'fastify';
import env from './config/env';
import { RESPONSE_PAIR } from './constants/common';
import { loadScript, runScript } from './script/loader';
import typia from 'typia';
import { Request } from './types/common';

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
    console.error(error);
    return reply
        .code(500)
        .send({
            ...RESPONSE_PAIR.ERROR
        });
  }
});

// 서버 시작
fastify.listen({ port: env.serverPort, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
