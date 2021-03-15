import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import { app } from './server'
import serverless from 'serverless-http'

module.exports.handler = async (...args: [any, any]) => {
  const appPls = await app

  return serverless(appPls)(...args)
}
