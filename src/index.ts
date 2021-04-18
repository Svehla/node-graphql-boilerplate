import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
import { appEnvs } from './appConfig'
import { getServerAdminApp } from './server_admin'
import { getServerIteratorRoute } from './server_iterator'
import express from 'express'

const port = appEnvs.PORT

const main = async () => {
  const app = express()
  app.use('/iterator', await getServerIteratorRoute())
  app.use('/admin', await getServerAdminApp())

  app.listen(port, () => {
    console.info(`
--------- server is ready now ---------
GQL        URL: http://localhost:${port}/admin/graphql
Playground URL: http://localhost:${port}/admin/playground
Iterator   URL: http://localhost:${port}/iterator/add-1
---------------------------------------
  `)
  })
}

main()
