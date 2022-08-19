import { ddbClient } from '../../config/db'
const { UmzugStorage, Umzug } = require('umzug')

class DynamoDBStorage extends UmzugStorage {
  constructor({ client, tableName }) {
    this.client = client
    this.tableName = tableName || 'migrations'
  }

  async logMigration({ name }) {
    const tableExists =
      (
        await ddbClient
          .listTables({
            ExclusiveStartTableName: this.tableName,
            Limit: 1,
          })
          .promise()
      ).TableNames.length === 1

    if (!tableExists) {
      // Create table
    }

    // Log migration
  }

  async unlogMigration({ name }) {
    // Delete migration
  }

  async executed() {
    // Return executed migrations
  }
}

const migrate = async (path, fn) => {
  const migration = require(path)

  return await migration[fn]
}

const migrator = new Umzug({
  migrations: {
    glob: 'src/db/migrations/*.up.js',
    resolve: ({ name, path }) => ({
      name,
      up: async () => await migrate(path, 'up'),
      down: async () =>
        await migrate(path.replace('.up.js', '.down.js'), 'down'),
    }),
  },
  context: ddbClient,
  storage: new DynamoDBStorage({
    client: ddbClient,
    tableName: 'migrations_meta',
  }),
  logger: console,
})

const resolveCommand = async () => {
  try {
    const thirdArgument = process.argv[2]
    const fourthArgument = process.argv[3]

    if (thirdArgument !== 'migrate') {
      throw new Error('Invalid command')
    }

    if (fourthArgument !== 'up' && fourthArgument !== 'down') {
      throw new Error(
        `Invalid '${fourthArgument}' command. Do you mean 'up' or 'down'?`
      )
    }

    fourthArgument === 'up'
      ? await migrator.up()
      : await migrator.down({ to: 0 })
  } catch (error) {
    Logger.error(error)
  }
}

export default resolveCommand()
