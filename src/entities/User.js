const { Table, Entity } = require('dynamodb-toolbox')
const { DocumentClient } = require('../../config/db')
const Password = require('../helpers/password')

const UserTable = new Table({
  name: 'users',
  partitionKey: 'username',
  indexes: { usersIndex: { partitionKey: 'id' } },
  sortKey: 'createdAt',
  DocumentClient,
})

const User = new Entity({
  name: 'User',
  attributes: {
    id: { partitionKey: 'usersIndex' },
    username: {
      type: 'string',
      required: 'always',
      partitionKey: true,
    },
    password: {
      type: 'string',
      required: 'always',
    },
    createdAt: { type: 'string', sortKey: true, default: new Date() },
  },
  table: UserTable,
})

module.exports = { User, UserTable }
