import { appEnvs } from './appEnvs'
// import { customFormatErrorFn } from 'apollo-errors'
import { customBearerAuth } from './auth/customBearerAuthMiddleware'
import { dbConnection } from './database/dbCore'
import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'
import express from 'express'
import graphqlPlayground from 'graphql-playground-middleware-express'
// import jwksClient from 'jwks-rsa'
// import jwt from 'express-jwt'
import schema from './gql/schema'

const app = express()

process.on('uncaughtException', err => {
  console.error(err)
})
process.on('unhandledRejection', err => {
  console.error(err)
})

// const checkAuth0Jwt = jwt({
//   secret: jwksClient.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `https://${appEnvs.auth0.DOMAIN}/.well-known/jwks.json`,
//   }),
//   audience: appEnvs.auth0.AUDIENCE,
//   issuer: `https://${appEnvs.auth0.DOMAIN}/`,
//   algorithms: ['RS256'],
// })

const startServer = async () => {
  // wait till the app is connected into database
  await dbConnection

  const port = appEnvs.PORT
  // custom back-office setup
  app.use(express.text({ type: 'application/graphql' }))
  app.use(express.urlencoded())
  app.use(express.json())

  app.use(cors({ origin: appEnvs.frontOffice.DOMAIN }))

  // app.use(checkJwt)
  // app.get('/api/external', checkAuth0Jwt, (_req, res) => {
  //   res.send({
  //     msg: 'Your access token was successfully validated!',
  //   })
  // })

  app.get(
    '/playground',
    graphqlPlayground({
      endpoint: '/graphql',
      subscriptionEndpoint: '/subscriptions',
    })
  )

  app.use(
    '/graphql',
    customBearerAuth,
    graphqlHTTP(req => ({
      // TODO: add error formatting?
      // formatError: customFormatErrorFn,
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
