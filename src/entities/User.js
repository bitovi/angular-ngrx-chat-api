const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')

const table = new Table({
  name: 'users',
  partitionKey: 'id',
  sortKey: 'createdAt',
  DocumentClient,
})

const User = new Entity({
  name: 'User',
  attributes: {
    id: { partitionKey: true },
    username: { type: 'string' },
    createdAt: { sortKey: true },
  },
  table,
})

module.exports = User
