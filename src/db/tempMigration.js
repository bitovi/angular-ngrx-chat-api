const { ddbClient } = require('../../config/db')
const { createTableIfNotExist } = require('../helpers/createTableIfNotExist')
const tables = require('./tables')

const tempMigration = async () => {
  // Temporary: Drop tablesInDB, till migrations functionality is set

  const tablesInDB = (await ddbClient.listTables().promise()).TableNames

  for (let i = 0; i < tablesInDB.length; i++) {
    const TableName = tablesInDB[i]

    await ddbClient.deleteTable({ TableName }).promise()
    console.log(`${TableName} table deleted.`)
  }

  tables.forEach(async (table) => {
    await createTableIfNotExist(table)
  })

  console.log('Migrations complete.')
}

module.exports = { tempMigration }
