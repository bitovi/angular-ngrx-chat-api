const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')

const table = new Table({
  name: 'messages',
  partitionKey: 'id',
  sortKey: 'createdAt',
  DocumentClient,
})

const Message = new Entity({
  name: 'Message',
  attributes: {
    id: { partitionKey: true },
    chatId: { type: 'string' },
    userId: { type: 'string' },
    body: { type: 'string' },
    createdAt: { sortKey: true },
  },
  table,
})

module.exports = Message
