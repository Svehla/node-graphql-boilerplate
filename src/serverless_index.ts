import 'reflect-metadata'
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

import serverless from 'serverless-http'

import { app } from './server'
// import { app } from './serverless_server'

module.exports.handler = async (...args: [any, any]) => {
  const appPls = await app

  return serverless(appPls)(...args)
}
