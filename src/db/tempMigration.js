const { createTableIfNotExist } = require('../helpers/createTableIfNotExist')

const tempMigration = async () => {
  const tableNames = ['chats', 'messages', 'users']

  for (let i = 0; i < tableNames.length; i++) {
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
      TableName: tableNames[i],
    })
  }

  console.log('Migrations complete.')
}
module.exports = { tempMigration }
