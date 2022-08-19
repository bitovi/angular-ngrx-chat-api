const { ddbClient } = require('../../config/db')
const { signToken } = require('../helpers/signToken')
const { routes } = require('../routes')

const sockets = async function (fastify) {
  fastify.post('/signup', async (request, reply) => {
    try {
      reply.send({
        token: signToken(request.body.username),
        username: request.body.username,
      })
    } catch (err) {
      console.error(err)
    }
  })

  fastify.post('/signin', (request, reply) => {
    reply.send({
      token: signToken(request.body.username),
    })
  })

  Object.values(routes).forEach((route) => fastify.route(route))
}

module.exports = { sockets }
