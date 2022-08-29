const schema = {
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        data: { type: 'object' },
      },
    },
  },
}

const routes = {
  createChat: {
    method: 'POST',
    url: '/chat',
    schema,
    handler: async (request, reply) => {
      try {
        reply.send({ message: 'Chat(WIP)', data })
      } catch (error) {
        console.log('error =>', error)
      }
    },
  },
  createUp: {
    method: 'GET',
    url: '/up',
    schema,
    handler: async (request, reply) => {
      try {
        reply.send({ message: 'up' })
      } catch (error) {
        console.log('error =>', error)
      }
    },
  },
}

module.exports = { routes }
