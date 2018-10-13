import { formatError } from 'apollo-errors'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import { execute, subscribe } from 'graphql'
import graphqlPlayground from 'graphql-playground-middleware-express'
import * as helmet from 'helmet'
import { createServer } from 'http'
import * as passport from 'passport'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { customBearerAuth, onConnectWssAuth, setupPassport } from './auth/jwtPassportAuth'
import schema from './gql/rootSchema'

setupPassport()
process.on('uncaughtException', err => {
  console.error(err)
})
process.on('unhandledRejection', err => {
  console.error(err)
})

const startServer = async () => {
  const port = process.env.PORT
  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.text({ type: 'application/graphql' }))
  app.use(passport.initialize())
  app.use(passport.session())

  const playroundUrl = process.env.ENVIROMENT !== 'production'
    ? '/playground'
    : '/super-secret-playground'

  app.get(playroundUrl, graphqlPlayground({
    endpoint: '/graphql',
    subscriptionEndpoint: '/subscriptions'
  }))

  app.use(
    '/graphql',
    customBearerAuth,
    graphqlHTTP(req => ({
      formatError,
      schema,
      context: {
        req,
      },
    })),
  )

  const ws = createServer(app)
  return ws.listen(port, () => {
    // Set up the WebSocket for handling GraphQL subscriptions
    // tslint:disable-next-line
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
      onConnect: onConnectWssAuth
    }, {
      server: ws,
      path: '/subscriptions',
    })
    if (process.env.ENVIROMENT !== 'test') {
      console.log(`

--------- server is ready now ---------
Current env: ${process.env.ENVIROMENT}
Server URL: http://localhost:${process.env.PORT}/graphql
---------------------------------------
      `)
    }
  })
}

const stopServer = async (server) => {
  // TODO: TypeError: Cannot read property 'close' of undefined
  server.close()
  if (process.env.ENVIROMENT !== 'test') {
    console.log('----------- server stopped ------------')
  }
}

export {
  startServer,
  stopServer,
}
