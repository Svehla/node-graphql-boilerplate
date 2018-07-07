import * as express from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import graphqlPlayground from 'graphql-playground-middleware-express'
import * as graphqlHTTP from 'express-graphql'
import * as helmet from 'helmet'
import * as passport from 'passport'
import { setupPassport, customBearerAuth } from './services/auth'
import schema from './gql'

setupPassport()
// tslint:disable-next-line
const packageJson = require('../package.json')

process.on('uncaughtException', err => {
  console.error(err)
})
process.on('unhandledRejection', err => {
  console.error(err)
})

const startServer = async () => {
  const app = express()

  app.use(cors())
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(bodyParser.text({ type: 'application/graphql' }))
  app.use(passport.initialize())
  app.use(passport.session())

  if (process.env.ENVIROMENT !== 'production') {
    app.get('/playground', graphqlPlayground({ endpoint: '/graphql' }))
  }
  app.use(
    '/graphql',
    customBearerAuth,
    graphqlHTTP(req => ({
      schema,
      context: {
        req,
      },
    })),
  )
  const port = process.env.PORT

  return app.listen(port, () => {
    if (process.env.ENVIROMENT !== 'test') {
      console.log(`

--------- server is ready now ---------
Current env: ${process.env.ENVIROMENT}
Current version: ${packageJson.version}
Server URL: http://localhost:${process.env.PORT}/graphql
---------------------------------------

`)
    }
  })
}

const stopServer = async (app) => {
  app.close()
  if (process.env.ENVIROMENT !== 'test') {
    console.log('----------- server stopped ------------')
  }
}

export {
  startServer,
  stopServer,
}
