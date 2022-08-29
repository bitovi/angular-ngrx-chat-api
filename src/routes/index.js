const { signToken } = require('../helpers/signToken')
const { decipherToken } = require('../helpers/decipherToken')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../managers/error/ErrorResponse')
const User = require('../entities/User')
const { statusCodes, codes } = require('../managers/error/constants')
const Password = require('../helpers/password')
const { v4: uuidv4 } = require('uuid')
const ChatMessage = require('../entities/ChatMessage')

const routes = async (fastify) => {
  // Sign up
  fastify.post(
    '/signup',
    asyncHandler(async (request, reply) => {
      const { username, password } = request.body

      if (!username) {
        throw new ErrorResponse({
          title: 'Please provide an username.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'username',
        })
      } else if (!password) {
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
        password: await Password.toHash(password),
      })

      reply.send({
        token: signToken(id),
      })
    })
  )

  // Sign in
  fastify.post(
    '/signin',
    asyncHandler(async (request, reply) => {
      const { username, password } = request.body

      if (!username) {
        throw new ErrorResponse({
          title: 'Please provide an username.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'username',
        })
      } else if (!password) {
        throw new ErrorResponse({
          title: 'Password is required.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'password',
        })
      }

      // TODO: Generate user instead with a random username and password
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

      const passwordsMatch = await Password.compare(user.password, password)

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
        token: signToken(user.id),
        data: user,
      })
    })
  )

  // Create chats
  fastify.post(
    '/chat',
    asyncHandler(async (request, reply) => {
      const { chatName } = request.body

      if (!chatName) {
        throw new ErrorResponse({
          title: 'Please provide a chatName.',
          code: codes.ERR_PARAMETER_REQUIRED,
          status: statusCodes.UNPROCESSABLE_ENTITY,
          pointer: 'chatName',
        })
      }

      const chatId = uuidv4()

      // TODO: Add unique constraint for chatName
      await ChatMessage.put({
        chatId,
        chatName,
      })

      reply.send({
        data: {
          chatId,
          chatName,
        },
      })
    })
  )

  // Get Messages
  fastify.get(
    '/chat/:id/messages',
    asyncHandler(async (request, reply) => {
      const chatId = request.params.id

      if (!chatId)
        connection.socket.send(
          JSON.stringify(
            new ErrorResponse({
              title: 'chatId is required',
              status: statusCodes.BAD_REQUEST,
              code: codes.ERR_PARAMETER_REQUIRED,
              parameter: 'chatId',
            })
          )
        )

      // TODO: Implement pagination
      const messages = (await ChatMessage.query(chatId)).Items

      //  TODO: Define response format
      reply.send({
        data: messages,
      })
    })
  )

  // Send Message
  fastify.get(
    '/chat/:id/send',
    { websocket: true },
    async (connection, request) => {
      connection.socket.on('message', async (message) => {
        try {
          const chatId = request.params.id
          const [userId] = decipherToken(request.headers.authorization)
          message = message.toString()

          if (!chatId)
            throw new ErrorResponse({
              title: 'chatId is required',
              status: statusCodes.BAD_REQUEST,
              code: codes.ERR_PARAMETER_REQUIRED,
              parameter: 'chatId',
            })

          // TODO: Needs to be cache, can't query these every time we send a message
          let [chat, user] = await Promise.all([
            ChatMessage.query(chatId),
            User.query(userId),
          ])

          chat = chat.Items[0]

          // TODO: Require token and run authentication
          const username = user.Items[0].username

          if (!chat)
            throw new ErrorResponse({
              title: 'Chat not found',
              status: statusCodes.NOT_FOUND,
              code: codes.ERR_NOT_FOUND,
              parameter: 'chatId',
            })

          const messageId = uuidv4()

          const messageObj = {
            chatId,
            chatName: chat.chatName,
            messageId,
            message,
            userId,
            username,
            sentAt: new Date(),
          }

          await ChatMessage.put(messageObj)

          connection.socket.send(JSON.stringify(messageObj))
        } catch (error) {
          console.log('Error =>', error)

          if (error instanceof ErrorResponse) {
            connection.socket.send(JSON.stringify(error))
          } else {
            connection.socket.send(
              JSON.stringify(
                new ErrorResponse({
                  title: error.message || 'Internal Server Error',
                  status: statusCodes.INTERNAL_SERVER_ERROR,
                  code: codes.ERR_SERVER_ERROR,
                })
              )
            )
          }
        }
      })
    }
  )

  fastify.get(
    '/up',
    asyncHandler(async (request, reply) => {
      try {
        reply.send({ message: 'up' })
      } catch (error) {
        console.log('error =>', error)
      }
    })
  )
}

module.exports = { routes }
