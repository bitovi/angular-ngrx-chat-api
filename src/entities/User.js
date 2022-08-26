const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')
const Password = require('../helpers/password')

const table = new Table({
  name: 'users',
  partitionKey: 'id',
  indexes: { usersIndex: { partitionKey: 'username' } },
  sortKey: 'createdAt',
  DocumentClient,
})

const User = new Entity({
  name: 'User',
  attributes: {
    id: { partitionKey: true },
    username: {
      type: 'string',
      required: 'always',
      partitionKey: 'usersIndex',
    },
    password: {
      type: 'string',
      required: 'always',
    },
    createdAt: { type: 'string', sortKey: true, default: new Date() },
  },
  table,
})

module.exports = User
