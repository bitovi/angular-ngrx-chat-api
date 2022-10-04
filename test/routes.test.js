// const server = global.server
const { ddbClient } = require('../config/db')
const build = require('../src/app')
const { tempMigration } = require('../src/db/tempMigration')
const { v4: uuidv4 } = require('uuid')
const { User } = require('../src/entities/User')
const Password = require('../src/helpers/password')
const waitForSocketState = require('../src/helpers/waitForSocketState')
const { ChatMessage } = require('../src/entities/ChatMessage')
const WebSocket = require('ws')
const { signToken } = require('../src/helpers/signToken')

let server, app

beforeAll(async () => {
  app = build()

  server = async (payload) => {
    const { statusCode, body } = await app.inject({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...payload,
    })

    return {
      statusCode,
      body: JSON.parse(body),
    }
  }

  await tempMigration()
})

describe('REST Routes', () => {
  test('Sign up', async () => {
    const { username, password } = {
      username: 'Kevin',
      password: 'whatever',
    }

    const { body, statusCode } = await server({
      method: 'POST',
      url: '/signup',
      payload: JSON.stringify({
        username,
        password,
      }),
    })

    expect(statusCode).toBe(201)
    expect(body).toHaveProperty('token')
  })

  test('Sign in', async () => {
    const { username, password } = {
      username: 'Marshall',
      password: 'whatever',
    }

    const id = uuidv4()

    await User.put({
      id,
      username,
      password: await Password.toHash(password),
    })

    const response = await server({
      method: 'POST',
      url: '/signin',
      payload: JSON.stringify({
        username,
        password,
      }),
    })

    expect(response.body).toHaveProperty('token')
    expect(response.body.data.id).toBe(id)
  })

  test('Create chats', async () => {
    const chatName = 'Actions and Reducers'

    const { statusCode, body } = await server({
      method: 'POST',
      url: '/chat',
      payload: JSON.stringify({
        chatName,
      }),
    })

    expect(statusCode).toBe(201)
    expect(body.data.chatName).toBe(chatName)
  })

  test('Get chats', async () => {
    const chatId = uuidv4()
    const chatName = 'Actions and Reducers'

    await ChatMessage.put({
      chatId,
      chatName,
    })

    const { body } = await server({
      method: 'GET',
      url: '/chats',
    })

    expect(body.data[0].chatId).toBe(chatId)
    expect(body.data[0].chatName).toBe(chatName)
  })

  test('Get messages', async () => {
    const payload = {
      chatId: uuidv4(),
      chatName: 'Actions and Reducers',
      messageId: uuidv4(),
      message: 'Hello world',
      userId: uuidv4(),
      username: 'Marshall',
      sentAt: new Date(),
    }

    await ChatMessage.put(payload)

    const { body } = await server({
      method: 'GET',
      url: `/chat/${payload.chatId}/messages`,
    })

    expect(body.data[0].messageId).toBe(payload.messageId)
  })

  test('Send message', async () => {
    const { username, password, chatId, chatName } = {
      chatId: uuidv4(),
      chatName: 'Actions and Reducers',
      username: 'Marshall',
      password: 'whatever',
    }

    const id = uuidv4()

    await Promise.all([
      app.listen({ port: 0 }),
      ChatMessage.put({
        chatId,
        chatName,
      }),
      await User.put({
        id,
        username,
        password: await Password.toHash(password),
      }),
    ])

    const client = new WebSocket(
      `ws://localhost:${app.server.address().port}/chat/${chatId}/send`,
      {
        headers: {
          authorization: `Bearer ${signToken(id)}`,
        },
      }
    )

    await waitForSocketState(client, client.OPEN)

    const testMessage = 'Hello world'

    let responseMessage

    client.on('message', (data) => {
      responseMessage = JSON.parse(data)

      client.close()
    })

    client.send(testMessage)
    // // Perform assertions on the response
    await waitForSocketState(client, client.CLOSED)

    console.log('responseMessage =>', responseMessage)
    expect(responseMessage.message).toBe(testMessage)
  })

  test('Health check', async () => {
    const response = await server({
      method: 'GET',
      url: '/up',
    })

    expect(response.statusCode).toBe(200)
  })
})

// afterAll(async () => {
//   //   server.close()

//   const tables = (await ddbClient.listTables().promise()).TableNames

//   for (let i = 0; i < tables.length; i++) {
//     const TableName = tables[i]

//     await ddbClient.deleteTable({ TableName }).promise()
//     console.log(`${TableName} table deleted.`)
//   }
// })
