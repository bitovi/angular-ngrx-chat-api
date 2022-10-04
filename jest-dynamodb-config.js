const tables = require('./src/db/tables')

/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */

require('dotenv').config()

console.log('process.env.DYNAMO_TEST_PORT =>', process.env.DYNAMO_TEST_PORT)

const config = {
  tables,
  port: process.env.DYNAMO_TEST_PORT,
}

module.exports = config
