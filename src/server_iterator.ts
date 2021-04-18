import './dynamo/config'
import 'express-async-errors'
import { appEnvs } from './appConfig'
import { docClient } from './dynamo/config'
import { removeTrailingSlash } from './utils/string'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'

export const getServerIteratorRoute = async () => {
  const app = express.Router()

  // custom back-office setup
  app.use(express.text({ type: 'application/graphql' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(cookieParser())

  app.use(
    cors((req, callback) => {
      callback(null, {
        credentials: true,
        origin: appEnvs.allowedOriginsUrls
          .map(removeTrailingSlash)
          .includes(req.header('Origin') ?? ''),
      })
    })
  )

  app.get('/add-1', async (_req, res) => {
    await docClient
      .update({
        TableName: appEnvs.aws.dynamoDB.tableName,
        Key: {
          PK: `SINGLETON_COUNTER`,
          SK: `SINGLETON_COUNTER`,
        },
        UpdateExpression: 'ADD iterator :iterator',
        ExpressionAttributeValues: {
          ':iterator': 1,
        },
        ReturnValues: 'NONE',
      })
      .promise(),
      res.send('+1')
  })

  app.get('/counter', async (_req, res) => {
    const counter = await docClient
      .query({
        TableName: appEnvs.aws.dynamoDB.tableName,
        KeyConditionExpression: '#PK = :PK and #SK = :SK',
        ExpressionAttributeNames: {
          '#PK': 'PK',
          '#SK': 'SK',
        },
        ExpressionAttributeValues: {
          ':PK': `SINGLETON_COUNTER`,
          ':SK': `SINGLETON_COUNTER`,
        },
      })
      .promise()

    res.send(counter)
  })

  app.get('*', (_req, res) => {
    res.send(`<h1>iterator service - 404</h1>`)
  })

  return app
}
