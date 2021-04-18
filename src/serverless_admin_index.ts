import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import { getServerAdminApp } from './server_admin'
import express from 'express'
import serverless from 'serverless-http'

module.exports.handler = async (...args: [any, any]) => {
  const app = express()
  const adminRoute = await getServerAdminApp()
  app.use('/admin', adminRoute)

  return serverless(app)(...args)
}
