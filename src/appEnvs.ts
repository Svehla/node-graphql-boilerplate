import {
  getIdentityFn,
  getNumberFromEnvParser,
  getStringEnumFromEnvParser,
  getStringFromEnvParser,
} from './libs/config/configEnvParsers'
import { validateConfig } from './libs/config/validateConfig'

export const appEnvs = validateConfig({
  PORT: getNumberFromEnvParser('PORT'),
  ENVIRONMENT: getStringEnumFromEnvParser('ENVIRONMENT', ['production', 'test', 'dev'] as const),
  NODE_ENV: getStringEnumFromEnvParser('NODE_ENV', ['production', 'development'] as const),

  postgres: {
    HOST: getStringFromEnvParser('POSTGRES_HOST'),
    USER: getStringFromEnvParser('POSTGRES_USER'),
    DB_NAME: getStringFromEnvParser('POSTGRES_DB_NAME'),
    PASSWORD: getStringFromEnvParser('POSTGRES_PASSWORD'),
    PORT: getIdentityFn(5432),
  },

  // // TODO: check if this config is still valid
  // auth0: {
  //   DOMAIN: getStringFromEnvParser('AUTH0_DOMAIN'),
  //   CLIENT_ID: getStringFromEnvParser('AUTH0_CLIENT_ID'),
  //   AUDIENCE: getStringFromEnvParser('AUTH0_AUDIENCE'),
  // },

  frontOffice: {
    DOMAIN: getStringFromEnvParser('BACK_OFFICE_DOMAIN'),
  },

  auth: {
    JWT_SECRET: getStringFromEnvParser('JWT_SECRET'),
  },
})
