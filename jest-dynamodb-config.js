const tables = require('./src/db/tables')

/**
 * @type {import('@shelf/jest-dynamodb/lib').Config}')}
 */

const config = {
  tables,
}

module.exports = config
