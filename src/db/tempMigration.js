const { createTableIfNotExist } = require('../helpers/createTableIfNotExist')

const tempMigration = async () => {
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
        AttributeName: 'sentAt',
        AttributeType: 'S',
      },
      {
        AttributeName: 'chatName',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'chatName',
        KeyType: 'HASH',
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
          {
            AttributeName: 'sentAt',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          NonKeyAttributes: ['chatId', 'sentAt'],
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
