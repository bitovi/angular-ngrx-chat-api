const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')

const table = new Table({
  name: 'chats',
  partitionKey: 'id',
  sortKey: 'createdAt',
  DocumentClient,
})

const Chat = new Entity({
  name: 'Chat',
  attributes: {
    id: { partitionKey: true },
    name: { type: 'string' },
    createdAt: { sortKey: true },
  },
  table,
})

module.exports = Chat
