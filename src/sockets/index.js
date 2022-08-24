const { ddbClient } = require('../../config/db')
const { signToken } = require('../helpers/signToken')
const asyncHandler = require('../middlewares/asyncHandler')
const { routes } = require('../routes')
const ErrorResponse = require('../managers/error/ErrorResponse')
const User = require('../entities/User')
const { statusCodes, codes } = require('../managers/error/constants')
const Password = require('../helpers/password')
const { v4: uuidv4 } = require('uuid')

const sockets = async function (fastify) {
  fastify.post(
    '/signup',
    asyncHandler(async (request, reply) => {
      const { username, password } = request.body

      if (!username || username === '') {
        throw new ErrorResponse({
          title: 'Please provide an username.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'username',
        })
      } else if (!password || password === '') {
        throw new ErrorResponse({
          title: 'Password is required.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'password',
        })
      }

      // TODO: Add unique constraint for username

      const id = uuidv4()

      await User.put({
        id,
        username,
        password,
      })

      reply.send({
        token: signToken(id),
      })
    })
  )

  fastify.post(
    '/signin',
    asyncHandler(async (request, reply) => {
      const { username, password } = request.body

      if (!username || username === '') {
        throw new ErrorResponse({
          title: 'Please provide an username.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'username',
        })
      } else if (!password || password === '') {
        throw new ErrorResponse({
          title: 'Password is required.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'password',
        })
      }

      const user = (await User.query(username, { index: 'usersIndex' }))
        .Items[0]

      if (!user) {
        throw new ErrorResponse({
          title: "Username doesn't exist.",
          code: codes.ERR_NOT_FOUND, //
          status: statusCodes.NOT_FOUND,
          pointer: 'username',
        })
      }

      const passwordsMatch = Password.compare(user.password, password)

      if (!passwordsMatch) {
        throw new ErrorResponse({
          title: 'Username or password is incorrect.',
          code: codes.ERR_CONFLICT,
          status: statusCodes.CONFLICT,
          pointer: 'password',
        })
      }

      delete user.password

      reply.send({
        token: signToken(request.body.username),
        data: user,
      })
    })
  )

  Object.values(routes).forEach((route) => fastify.route(route))
}

module.exports = { sockets }
