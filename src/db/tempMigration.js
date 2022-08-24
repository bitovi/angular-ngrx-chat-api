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
    GlobalSecondaryIndexes: [
      {
        IndexName: 'usersIndex',
        KeySchema: [
          {
            AttributeName: 'username',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          NonKeyAttributes: ['username', 'password'],
          ProjectionType: 'INCLUDE',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
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
    ],
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
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'chatMessages',
  })

  console.log('Migrations complete.')
}
module.exports = { tempMigration }
