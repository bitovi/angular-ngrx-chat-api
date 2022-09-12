const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')

const ChatMessageTable = new Table({
  name: 'chatMessages',
  partitionKey: 'chatName',
  indexes: { chatMessagesIndex: { partitionKey: 'chatId' } },
  sortKey: 'sentAt',
  DocumentClient,
})

const ChatMessage = new Entity({
  name: 'ChatMessage',
  attributes: {
    chatId: {
      partitionKey: 'chatMessagesIndex',
      type: 'string',
      required: 'always',
    },
    chatName: {
      type: 'string',
      partitionKey: true,
    },
    messageId: { type: 'string' },
    message: { type: 'string' },
    userId: { type: 'string' },
    username: { type: 'string' },
    sentAt: {
      sortKey: true,
      default: new Date(),
    },
  },
  table: ChatMessageTable,
})

module.exports = { ChatMessage, ChatMessageTable }
