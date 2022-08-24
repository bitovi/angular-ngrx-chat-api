const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')
const { v4: uuidv4 } = require('uuid')

const table = new Table({
  name: 'chatMessages',
  partitionKey: 'chatName',
  sortKey: 'sentAt',
  DocumentClient,
})

const ChatMessage = new Entity({
  name: 'ChatMessage',
  attributes: {
    chatId: {
      partitionKey: true,
      unique: true,
      type: 'string',
      required: 'always',
      default: uuidv4(),
    },
    chatName: { unique: true, type: string, required: 'always' },
    messageId: { type: 'string' },
    message: { type: 'string' },
    userId: { type: 'string' },
    username: { type: 'string' },
    sentAt: { sortKey: true, default: new Date() },
  },
  table,
})

module.exports = ChatMessage
