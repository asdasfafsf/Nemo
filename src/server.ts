import Fastify from 'fastify';
import env from './config/env';
import { RESPONSE_PAIR } from './constants/common';
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
    return reply
        .code(200)
        .send({
            ...RESPONSE_PAIR.SUCCESS
        });
  } catch (error) {
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
