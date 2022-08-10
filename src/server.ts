import fastify from 'fastify'
import { routes } from './routes'

const server = fastify()

Object.values(routes).forEach((route) => server.route(route))

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
