const fastify = require('fastify')
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

server.listen({ port: process.env.PORT, host: '::' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
