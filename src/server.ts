import './emails/index'
import { appEnvs } from './appEnvs'
import { customBearerAuth } from './auth/customBearerAuthMiddleware'
import { dbConnection } from './database/dbCore'
import { graphqlHTTP } from 'express-graphql'
import axios from 'axios'
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
  app.use(express.urlencoded())
  app.use(express.json())

  app.use(cors({ origin: appEnvs.frontOffice.DOMAIN }))

  // TODO: just POC for Rest-api GQL proxy
  app.get('/verify-reg-token/:token', async (req, res) => {
    try {
      const gqlRes = await axios.post(`${appEnvs.adminService.DOMAIN}/graphql`, {
        query: `
          mutation verifyUserEmailMutation(
            $verifyUserInput: Verify_user_input_mutation!
          ) {
            verifyUserEmailMutation(input: $verifyUserInput) {
              isTokenVerified
            }
          }
        `,
        variables: {
          verifyUserInput: { verifyToken: req.params.token },
        },
      })

      const isTokenVerified = gqlRes.data.data?.verifyUserEmailMutation?.isTokenVerified

      if (isTokenVerified) {
        res.redirect('http://localhost:2020/playground')
      } else {
        res.send('token is not valid')
      }
    } catch (err) {
      console.error(err)
      res.send(err)
    }
  })

  app.get(
    '/playground',
    graphqlPlayground({
      endpoint: '/graphql',
    })
  )

  app.use(
    '/graphql',
    customBearerAuth,
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
