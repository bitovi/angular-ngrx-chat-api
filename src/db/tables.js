const tables = [
  // Users table
  {
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
  },

  // ChatMessages table
  {
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
  },
]

module.exports = tables
