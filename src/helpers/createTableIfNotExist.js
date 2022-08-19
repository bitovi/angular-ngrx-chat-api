const { ddbClient } = require('../../config/db')

const createTableIfNotExist = async (params) => {
  const TableName = params.TableName

  try {
    await ddbClient.describeTable({ TableName }).promise()

    console.log(`${TableName} table already exists.`)
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      await ddbClient.createTable(params).promise()

      console.log(`${TableName} table created`)
    }
  }
}

module.exports = { createTableIfNotExist }
