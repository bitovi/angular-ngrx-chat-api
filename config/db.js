const AWS = require('aws-sdk')

const { DYNAMO_REGION, DYNAMO_URL, DYNAMO_PORT } = process.env

const DynamoDB = AWS.DynamoDB

const ddbClient = new DynamoDB({
  region: DYNAMO_REGION,
  endpoint: `${DYNAMO_URL}:${DYNAMO_PORT}`,
})

const DocumentClient = new DynamoDB.DocumentClient({
  service: ddbClient,
})

module.exports = { ddbClient, DocumentClient }
