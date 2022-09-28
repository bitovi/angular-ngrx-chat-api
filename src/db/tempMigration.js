const { ddbClient } = require('../../config/db')
const { createTableIfNotExist } = require('../helpers/createTableIfNotExist')

const tempMigration = async () => {
  // Temporary: Drop tables, till migrations functionality is set
  const tables = (await ddbClient.listTables().promise()).TableNames

  for (let i = 0; i < tables.length; i++) {
    const TableName = tables[i]

    await ddbClient.deleteTable({ TableName }).promise()
    console.log(`${TableName} table deleted.`)
  }

  // Users table
  await createTableIfNotExist({
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
      {
        AttributeName: 'createdAt',
        AttributeType: 'S',
      },
      {
        AttributeName: 'username',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'username',
        KeyType: 'HASH',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'usersIndex',
        KeySchema: [
          {
            AttributeName: 'id',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'createdAt',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          NonKeyAttributes: ['password'],
          ProjectionType: 'INCLUDE',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'users',
  })

  // ChatMessages table
  await createTableIfNotExist({
    AttributeDefinitions: [
      {
        AttributeName: 'chatId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'chatName',
        AttributeType: 'S',
      },
      {
        AttributeName: 'sentAt',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'chatName',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'sentAt',
        KeyType: 'RANGE',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'chatMessagesIndex',
        KeySchema: [
          {
            AttributeName: 'chatId',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          NonKeyAttributes: [
            'sentAt',
            'chatId',
            'messageId',
            'message',
            'userId',
            'username',
          ],
          ProjectionType: 'INCLUDE',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'chatMessages',
  })

  console.log('Migrations complete.')
}

module.exports = { tempMigration }
