import './emails/index'
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

const app = express()

process.on('uncaughtException', err => {
  console.error(err)
})
process.on('unhandledRejection', err => {
  console.error(err)
})

const startServer = async () => {
  // wait till the app is connected into database
  await dbConnection

  const port = appEnvs.PORT
  // custom back-office setup
  app.use(express.text({ type: 'application/graphql' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(cookieParser())

  app.use(cors({ origin: appEnvs.frontOffice.DOMAIN }))

  initGoogleAuthStrategy(app)
  // TODO: just POC for Rest-api GQL proxy - kinda shitty code
  app.get('/verify-reg-token/:token', verifyEmailRestGqlProxy)

  app.get(
    '/playground',
    graphqlPlayground({
      endpoint: '/graphql',
      // TODO: setup credentials somehow
      // settings: {
      //   'request.credentials': 'include',
      // },
      // 'request.credentials': 'include',
    })
  )

  app.use(
    '/graphql',
    [customBearerAuth, parseGoogleAuthCookieMiddleware],
    graphqlHTTP(req => ({
      schema,
      context: {
        req,
      },
    }))
  )

  app.listen(port)

  app.get('*', (_req, res) => {
    res.send(`<h1>404</h1>`)
  })

  console.info(`
  --------- server is ready now ---------
  GQL URL: http://localhost:${port}/graphql
  Playground URL: http://localhost:${port}/playground
  ---------------------------------------
  `)
}

const stopServer = async (server: any) => {
  // TODO: TypeError: Cannot read property 'close' of undefined
  server.close()
  if (appEnvs.ENVIRONMENT !== 'production') {
    console.info('----------- server stopped ------------')
  }
}

export { startServer, stopServer }
