const AWS = require('aws-sdk')

require('dotenv').config()

const {
  DYNAMO_REGION,
  DYNAMO_URL,
  DYNAMO_TEST_URL,
  DYNAMO_TEST_PORT,
  DYNAMO_PORT,
} = process.env

const DynamoDB = AWS.DynamoDB

const endpoint =
  process.env.NODE_ENV === 'test'
    ? `${DYNAMO_TEST_URL}:${DYNAMO_TEST_PORT}`
    : `${DYNAMO_URL}:${DYNAMO_PORT}`

console.log('endpoint =>', endpoint)
const ddbClient = new DynamoDB({
  region: DYNAMO_REGION,
  endpoint,
  // sslEnabled: false,
})

const DocumentClient = new DynamoDB.DocumentClient({
  service: ddbClient,
})

module.exports = { ddbClient, DocumentClient }
