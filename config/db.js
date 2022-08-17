const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')

const { DYNAMO_REGION, DYNAMO_URL, DYNAMO_PORT } = process.env

const ddbClient = new DynamoDBClient({
  region: DYNAMO_REGION,
  endpoint: `${DYNAMO_URL}:${DYNAMO_PORT}`,
})

module.exports = { ddbClient }
