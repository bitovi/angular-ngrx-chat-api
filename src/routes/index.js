const { signToken } = require('../helpers/signToken')
const { decipherToken } = require('../helpers/decipherToken')
const asyncHandler = require('../middlewares/asyncHandler')
const ErrorResponse = require('../managers/error/ErrorResponse')
const { User, UserTable } = require('../entities/User')
const { statusCodes, codes } = require('../managers/error/constants')
const Password = require('../helpers/password')
const { v4: uuidv4 } = require('uuid')
const { ChatMessage, ChatMessageTable } = require('../entities/ChatMessage')

const md = require('markdown-it')({
  html: true,
  typographer: true,
  linkify: true,
  highlight: (str, lang) =>
    `
        <code style="
          display: block;
          padding: 9.5px;
          margin: 0px auto 0px auto;
          font-size: 13px;
          line-height: 1.42857143;
          color: #333;
          word-break: break-all;
          word-wrap: break-word;
          background-color: #f5f5f5;
          border: 1px solid #ccc;
          border-radius: 4px;"
          >
            ${str}
        </code>
    `,
})

const fs = require('fs')
const path = require('path')
const util = require('util')
const user = require('../schemas/user')
const chatMessage = require('../schemas/chatMessage')

const readFile = util.promisify(fs.readFile)

const routes = async (fastify) => {
  // Docs
  fastify.get(
    '/ws/docs',
    {
      schema: {
        description: 'Websocket docs at /ws/docs',
      },
    },
    asyncHandler(async (request, reply) => {
      const markdownOutput = await readFile(
        path.resolve(__dirname, '../docs/ws.md'),
        'utf8'
      )

      reply.type('text/html').send(md.render(markdownOutput))
    })
  )

  // fastify.route({
  //   method: 'POST',
  //   url: '/signup',
  //   handler: asyncHandler(async (request, reply) => {
  //     const { username, password } = request.body

  //     if (!username) {
  //       throw new ErrorResponse({
  //         title: 'Please provide an username.',
  //         code: codes.ERR_PARAMETER_REQUIRED,
  //         status: statusCodes.UNPROCESSABLE_ENTITY,
  //         pointer: 'username',
  //       })
  //     } else if (!password) {
  //       throw new ErrorResponse({
  //         title: 'Password is required.',
  //         code: codes.ERR_PARAMETER_REQUIRED,
  //         status: statusCodes.UNPROCESSABLE_ENTITY,
  //         pointer: 'password',
  //       })
  //     }

  //     const id = uuidv4()

  //     try {
  //       await UserTable.transactWrite([
  //         User.putTransaction(
  //           {
  //             id,
  //             username,
  //             password: await Password.toHash(password),
  //           },
  //           {
  //             conditions: {
  //               attr: 'username',
  //               exists: false,
  //             },
  //           }
  //         ),
  //       ])

  //       reply.send({
  //         token: signToken(id),
  //       })
  //     } catch (error) {
  //       if (error.code === 'TransactionCanceledException') {
  //         throw new ErrorResponse({
  //           title: 'User with username already exists.',
  //           code: codes.ERR_DUPLICATE_PARAMETER,
  //           status: statusCodes.CONFLICT,
  //           pointer: 'username',
  //         })
  //       } else {
  //         throw error
  //       }
  //     }
  //   }),
  //   schema: user.signup,
  // })
  // Sign up
  fastify.post(
    '/signup',
    {
      schema: user.signup,
    },
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

      const id = uuidv4()

      try {
        await UserTable.transactWrite([
          User.putTransaction(
            {
              id,
              username,
              password: await Password.toHash(password),
            },
            {
              conditions: {
                attr: 'username',
                exists: false,
              },
            }
          ),
        ])

        reply.send({
          token: signToken(id),
        })
      } catch (error) {
        if (error.code === 'TransactionCanceledException') {
          throw new ErrorResponse({
            title: 'User with username already exists.',
            code: codes.ERR_DUPLICATE_PARAMETER,
            status: statusCodes.CONFLICT,
            pointer: 'username',
          })
        } else {
          throw error
        }
      }
    })
  )

  // Sign in
  fastify.post(
    '/signin',
    {
      schema: user.signin,
    },
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
      const user = (await User.query(username)).Items[0]

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
    {
      schema: chatMessage.createChat,
    },
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

      try {
        await ChatMessageTable.transactWrite([
          ChatMessage.putTransaction(
            {
              chatId,
              chatName,
            },
            {
              conditions: {
                attr: 'chatName',
                exists: false,
              },
            }
          ),
        ])
      } catch (error) {
        if (error.code === 'TransactionCanceledException') {
          throw new ErrorResponse({
            title: 'Chat with name already exists.',
            code: codes.ERR_DUPLICATE_PARAMETER,
            status: statusCodes.CONFLICT,
            pointer: 'chatName',
          })
        } else {
          throw error
        }
      }

      reply.send({
        data: {
          chatId,
          chatName,
        },
      })
    })
  )

  // Get chats
  fastify.get(
    '/chats',
    {
      schema: chatMessage.getChats,
    },
    asyncHandler(async (request, reply) => {
      const chats = (
        await ChatMessage.scan({
          filters: {
            attr: 'message',
            exists: false,
          },
        })
      ).Items

      //  TODO: Define response format
      reply.send({
        data: chats,
      })
    })
  )

  // Get Messages
  fastify.get(
    '/chat/:id/messages',
    {
      schema: chatMessage.getChatMessages,
    },
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

      // TODO: Check if chat exists

      // TODO: Implement pagination
      const messages = (
        await ChatMessage.query(chatId, {
          index: 'chatMessagesIndex',
          filters: {
            attr: 'message',
            exists: true,
          },
        })
      ).Items

      //  TODO: Define response format
      reply.send({
        data: messages,
      })
    })
  )

  // Send Message
  fastify.get(
    '/chat/:id/send',
    {
      websocket: true,
      schema: {
        // TODO: Include host
        description: 'Websocket docs at /ws/docs',
      },
    },
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
            ChatMessage.query(chatId, { index: 'chatMessagesIndex' }),
            User.query(userId, { index: 'usersIndex' }),
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

  // Health check
  fastify.get(
    '/up',
    {
      schema: {
        description: 'Health check',
        response: {
          default: {
            description: 'Success: API server is up and running',
            type: 'object',
            example: {
              message: 'up',
            },
          },
        },
      },
    },
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
