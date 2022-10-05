const fastify = require('fastify')
const { tempMigration } = require('./db/tempMigration')
const setupFastifySwagger = require('./fastify-swagger')
const generateSocketDocs = require('./helpers/generateSocketDocs')
const errorHandler = require('./managers/error/errorHandler')
const { routes } = require('./routes')

require('dotenv').config()

const server = fastify()

setupFastifySwagger(server)

server
  .register(require('@fastify/express'))
  // .register(require('@fastify/middie'))
  .register(require('@fastify/websocket'))
  .register(routes)

server.setErrorHandler(errorHandler)

server.listen({ port: process.env.PORT, host: '::' }, async (err, address) => {
  try {
    await tempMigration()
    await generateSocketDocs()

    console.log(`Server listening at ${address}`)
  } catch (error) {
    console.error('Server Error =>', error)
    process.exit(1)
  }
})
