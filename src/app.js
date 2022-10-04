const fastify = require('fastify')
const setupFastifySwagger = require('./fastify-swagger')
const errorHandler = require('./managers/error/errorHandler')
const { routes } = require('./routes')

require('dotenv').config()

const build = () => {
  const app = fastify()

  setupFastifySwagger(app)

  app
    .register(require('@fastify/express'))
    // .register(require('@fastify/middie'))
    .register(require('@fastify/websocket'))
    .register(routes)

  app.setErrorHandler(errorHandler)

  return app
}

module.exports = build
