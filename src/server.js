const fastify = require('fastify')
const { tempMigration } = require('./db/tempMigration')
const errorHandler = require('./managers/error/errorHandler')
const { routes } = require('./routes')
const { sockets } = require('./sockets')
require('dotenv').config()

const server = fastify()

server
  .register(require('@fastify/express'))
  // .register(require('@fastify/middie'))
  .register(require('@fastify/websocket'))
  .register(sockets)

// Object.values(routes).forEach((route) => server.route(route))

// Custom Error handler for JSON-API spec
server.setErrorHandler(errorHandler)

server.listen({ port: process.env.PORT, host: '::' }, async (err, address) => {
  try {
    await tempMigration()

    console.log(`Server listening at ${address}`)
  } catch (error) {
    console.error('Server Error =>', error)
    process.exit(1)
  }
})
