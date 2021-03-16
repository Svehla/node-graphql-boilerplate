import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import { app } from './server'
import { appEnvs } from './appConfig'

const port = appEnvs.PORT

app.then(a =>
  a.listen(port, () => {
    console.info(`
--------- server is ready now ---------
GQL URL: http://localhost:${port}/graphql
Playground URL: http://localhost:${port}/playground
---------------------------------------
  `)
  })
)
