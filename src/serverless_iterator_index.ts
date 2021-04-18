import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import { getServerIteratorRoute } from './server_iterator'
import express from 'express'
import serverless from 'serverless-http'

module.exports.handler = async (...args: [any, any]) => {
  const app = express()
  const iteratorRoute = await getServerIteratorRoute()
  app.use('/iterator', iteratorRoute)

  return serverless(app)(...args)
}
