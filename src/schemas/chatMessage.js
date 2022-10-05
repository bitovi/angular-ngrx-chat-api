const { makeIdParams } = require('./params')

const properties = {
  chatId: {
    type: 'string',
    format: 'uuid',
    description: "The chat's unique identifier",
    // example: '5d8e8a7e-e8e3-4d8e-b3d7-8e4b50e36b1c',
  },
  chatName: {
    type: 'string',
    description: 'Chat name',
    // example: 'Marshall',
  },
  messageId: {
    type: 'string',
    format: 'uuid',
    description: "The message's unique identifier",
    // example: '5d8e8a7e-e8e3-4d8e-b3d7-8e4b50e36b1c',
  },
  message: {
    type: 'string',
    description: 'Message body',
    // example: 'Marshall',
  },
  userId: {
    type: 'string',
    format: 'uuid',
    description: "The user's unique identifier",
    // example: '5d8e8a7e-e8e3-4d8e-b3d7-8e4b50e36b1c',
  },
  username: {
    type: 'string',
    description: 'Username of the user',
    // example: 'Marshall',
  },
  sentAt: {
    type: 'string',
    description: 'Sign up date',
    // example: '2022-09-28T19:05:43.633Z',
  },
}

const tags = ['chat']

const createChat = {
  description: 'Chat creation',
  summary: 'Create chat',
  tags,
  body: {
    type: 'object',
    required: ['chatName'],
    properties: {
      chatName: {
        type: 'string',
        description: 'chatName of the user',
        // example: 'Actions and Reducers',
      },
    },
    additionalProperties: false,
  },
  example: {
    chatName: 'Actions and Reducers',
  },
  errortitle: {
    required: {
      chatName: 'chatName is required',
    },
  },
  response: {
    default: {
      description: 'Success: Chat created',
      type: 'object',
      example: {
        data: {
          chatId: 'a889446b-550e-40ee-94ed-a503c1d7cc9e',
          chatName: 'Second chat',
        },
      },
    },
  },
}

const getChats = {
  description: 'retrieve a list of chats',
  summary: 'retrieve a list of chats',
  tags,
  response: {
    default: {
      description: 'Default response',
      type: 'object',
      example: {
        data: [
          {
            created: '2022-09-12T16:30:20.358Z',
            chatName: 'First chat',
            chatId: '5bc2a6bb-015c-4307-b2b6-09ff9093b7fa',
            modified: '2022-09-12T16:30:20.358Z',
            entity: 'ChatName',
          },
          {
            created: '2022-09-12T16:32:41.439Z',
            chatName: 'Second chat',
            chatId: 'a889446b-550e-40ee-94ed-a503c1d7cc9e',
            modified: '2022-09-12T16:32:41.439Z',
            entity: 'ChatName',
          },
        ],
      },
    },
  },
}

const getChatMessages = {
  description: 'retrieve a list of chat messages',
  summary: 'retrieve a list of chat messages',
  tags,
  params: makeIdParams('chat'),
  response: {
    default: {
      description: 'Default response',
      type: 'object',
      example: {
        data: [
          {
            chatId: '402d4647-05a7-4eaf-b6c4-36d14014719e',
            chatName: 'First chat',
            messageId: '1868ca6e-bb57-4bf7-8fd1-4a5bb88bad3e',
            sentAt:
              'Mon Sep 12 2022 20:17:21 GMT+0000 (Coordinated Universal Time)',
            message: 'I am good',
            userId: 'fac2b1c0-c23b-4853-96de-8d1c8a49f0b9',
            username: 'Marshall',
          },
          {
            chatId: '402d4647-05a7-4eaf-b6c4-36d14014719e',
            chatName: 'First chat',
            messageId: 'c90c1c4e-8c54-4d38-a4fc-3a48a4e7b838',
            sentAt:
              'Mon Sep 12 2022 20:16:56 GMT+0000 (Coordinated Universal Time)',
            message: 'I am good',
            userId: 'fac2b1c0-c23b-4853-96de-8d1c8a49f0b9',
            username: 'Marshall',
          },
          {
            chatId: '402d4647-05a7-4eaf-b6c4-36d14014719e',
            chatName: 'First chat',
            messageId: '84701ca0-6d64-449d-a78e-ab426d2eac63',
            sentAt:
              'Mon Sep 12 2022 20:17:12 GMT+0000 (Coordinated Universal Time)',
            message: 'How are you',
            userId: 'fac2b1c0-c23b-4853-96de-8d1c8a49f0b9',
            username: 'Marshall',
          },
        ],
      },
    },
  },
}

module.exports = {
  properties,
  createChat,
  getChats,
  getChatMessages,
}
