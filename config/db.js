const AWS = require('aws-sdk')

require('dotenv').config()

const { DYNAMO_REGION, DYNAMO_URL, DYNAMO_TEST_URL, DYNAMO_PORT } = process.env

const DynamoDB = AWS.DynamoDB

const ddbClient = new DynamoDB({
  region: DYNAMO_REGION,
  endpoint: `${
    process.env.NODE_ENV === 'test' ? DYNAMO_TEST_URL : DYNAMO_URL
  }:${DYNAMO_PORT}`,
})

const DocumentClient = new DynamoDB.DocumentClient({
  service: ddbClient,
})

module.exports = { ddbClient, DocumentClient }
