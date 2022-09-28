const errorSchema = require('./schemas/error')
const chatMessage = require('./schemas/chatMessage')

const user = require('./schemas/user')

const setupFastifySwagger = (fastify) => {
  fastify.register(require('@fastify/swagger'), {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'angular-ngrx-chat-api',
        description: 'Angular NgRx Websocket REST Endpoints',
        version: '0.1.0',
      },
      externalDocs: {
        url: '/ws/docs',
        description: 'Socket endpoint documentation',
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'user', description: 'User-related endpoints' },
        { name: 'chat', description: 'Chat-related endpoints' },
      ],
      definitions: {
        Error: {
          type: 'array',
          items: {
            type: 'object',
            properties: errorSchema,
          },
        },
        chatMessage: { type: 'object', properties: chatMessage.properties },
        user: { type: 'object', properties: user.properties },
      },
    },
    uiConfig: {
      deepLinking: false,
      operationsSorter: 'method',
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    exposeRoute: true,
  })
}

module.exports = setupFastifySwagger
