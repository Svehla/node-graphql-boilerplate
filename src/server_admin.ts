import './dynamo/config'
import './emails/index'
import 'express-async-errors'
// import { ApolloServer } from 'apollo-server-express'
import { GqlContext } from './utils/GqlContextType'
import { appEnvs } from './appConfig'
import { customBearerAuth } from './auth/customBearerAuth'
import { dbConnection } from './database/dbCore'
import { getDataLoaders } from './utils/dataLoaderCache'
import { graphqlHTTP } from 'express-graphql'
import { initGoogleAuthStrategy, parseGoogleAuthCookieMiddleware } from './auth/googleAuth'
import { removeTrailingSlash } from './utils/string'
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

export const getServerAdminApp = async () => {
  const app = express.Router()

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
        origin: appEnvs.allowedOriginsUrls
          .map(removeTrailingSlash)
          .includes(req.header('Origin') ?? ''),
      })
    })
  )

  // @ts-expect-error decide if to use routers vs express instances with different ports...
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
        dataLoaders: getDataLoaders(),
      } as GqlContext,
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
    res.send(`<h1>admin - 404</h1>`)
  })

  return app
}
