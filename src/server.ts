import './emails/index'
// import { ApolloServer } from 'apollo-server-express'
import { appEnvs } from './appConfig'
import { customBearerAuth } from './auth/customBearerAuth'
import { dbConnection } from './database/dbCore'
import { graphqlHTTP } from 'express-graphql'
import { initGoogleAuthStrategy, parseGoogleAuthCookieMiddleware } from './auth/googleAuth'
import { verifyEmailRestGqlProxy } from './gql/User/verifyEmailRestGqlProxy'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import graphqlPlayground from 'graphql-playground-middleware-express'
import schema from './gql/schema'

// TODO: ts-node-dev sometimes throw error:
// Error: write EPIPE
// > https://github.com/wclr/ts-node-dev/issues/148

process.on('uncaughtException', err => {
  console.error(err)
})
process.on('unhandledRejection', err => {
  console.error(err)
})

const getApp = async () => {
  const app = express()

  // wait till the app is connected into database
  await dbConnection

  // custom back-office setup
  app.use(express.text({ type: 'application/graphql' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(cookieParser())

  app.use(
    cors((req, callback) => {
      callback(null, {
        credentials: true,
        origin: appEnvs.allowedOriginsUrls.includes(req.header('Origin') ?? ''),
      })
    })
  )

  initGoogleAuthStrategy(app)
  // TODO: just POC for Rest-api GQL proxy - kinda shitty code
  app.get('/verify-reg-token/:token', verifyEmailRestGqlProxy)

  app.get(
    '/playground',
    graphqlPlayground({
      endpoint: '/graphql',
      // @ts-expect-error: missing Partial<> generic in the playground static types
      settings: {
        'request.credentials': 'include',
      },
    })
  )

  app.use(
    '/graphql',
    [customBearerAuth, parseGoogleAuthCookieMiddleware],
    graphqlHTTP((req, res) => ({
      schema,
      context: {
        res,
        req,
      },
    }))
  )

  /*
  // TODO: does not work after webpack bundle source code 

  app.use('/graphql', customBearerAuth)
  app.use('/graphql', parseGoogleAuthCookieMiddleware)

  const server = new ApolloServer({ schema, tracing: true, context: ({ req }) => ({ req }) })

  server.applyMiddleware({
    app,
    path: '/graphql',
  })
  */

  app.get('*', (_req, res) => {
    res.send(`<h1>404</h1>`)
  })

  return app
}

export const app = getApp()
