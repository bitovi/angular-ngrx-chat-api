const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')

const table = new Table({
  name: 'chatMessages',
  partitionKey: 'chatId',
  indexes: { chatMessagesIndex: { partitionKey: 'chatName' } },
  sortKey: 'sentAt',
  DocumentClient,
})

const ChatMessage = new Entity({
  name: 'ChatMessage',
  attributes: {
    chatId: {
      partitionKey: true,
      type: 'string',
      required: 'always',
    },
    chatName: {
      type: 'string',
      required: 'always',
      partitionKey: 'chatMessagesIndex',
    },
    messageId: { type: 'string' },
    message: { type: 'string' },
    userId: { type: 'string' },
    username: { type: 'string' },
    sentAt: { sortKey: true, default: new Date() },
  },
  table,
})

module.exports = ChatMessage
