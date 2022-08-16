const { ddbClient } = require('../../config/db')
const { signToken } = require('../helpers/signToken')
const { routes } = require('../routes')
const {
  CreateTableCommand,
  DeleteTableCommand,
} = require('@aws-sdk/client-dynamodb')

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

  // fastify.use(async (request, reply, next) => {
  //   if (!request.headers.authorization) {
  //     reply.send('Connection rejected')
  //   }

  //   const [user] = await DecipherToken(req.headers.authorization)

  //   request.user = user

  //   next()
  // })

  Object.values(routes).forEach((route) => fastify.route(route))
}

module.exports = { sockets }
