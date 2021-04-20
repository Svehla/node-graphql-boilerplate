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
    // TODO: move code into dynamo service layer
    const updatedCounter = await docClient
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
        ReturnValues: 'ALL_NEW',
      })
      .promise()

    res.send(`
      <div>
        <div>
          current count:
        </div>

        <pre>${JSON.stringify(updatedCounter.Attributes, null, 2)}</pre>
        <!-- todo: remove stage-1 -->
        <a href="/stage-1/iterator/add-1">
          <button>
            add 1
          </button>
        </a>
      </div>
    `)
  })

  app.get('*', (_req, res) => {
    res.send(`<h1>iterator service - 404</h1>`)
  })

  return app
}
