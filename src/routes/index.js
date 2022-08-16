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
  sendMessage: {
    method: 'GET',
    url: '/chat/message',
    schema,
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
    wsHandler: (connection, request) => {
      connection.socket.on('message', (message) => {
        connection.socket.send(message.toString())
      })
    },
  },

  join: {
    method: 'GET',
    url: '/chat/join',
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
    schema,
  },
  leave: {
    method: 'GET',
    url: '/chat/leave',
    handler: (request, reply) => {
      reply.send({ message: 'Authentication(WIP)' })
    },
    schema,
  },
}

module.exports = { routes }
