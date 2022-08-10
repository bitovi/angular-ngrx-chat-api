import { HTTPMethods } from 'fastify'

const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

const routes = {
  auth: {
    method: 'GET' as HTTPMethods,
    url: '/auth',
    schema,
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
  },

  join: {
    method: 'GET' as HTTPMethods,
    url: '/join',
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
    schema,
  },
  leave: {
    method: 'GET' as HTTPMethods,
    url: '/leave',
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
    schema,
  },
  message: {
    method: 'GET' as HTTPMethods,
    url: '/message',
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
    schema,
  },
}

export { routes }
