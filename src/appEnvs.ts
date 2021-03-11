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

  adminService: {
    DOMAIN: getIdentityFn('http://localhost:2020'),
  },

  frontOffice: {
    DOMAIN: getStringFromEnvParser('BACK_OFFICE_DOMAIN'),
  },

  auth: {
    JWT_SECRET: getStringFromEnvParser('JWT_SECRET'),
  },

  etherealMail: {
    HOST: getStringFromEnvParser('ETHEREAL_MAIL_HOST'),
    PORT: getNumberFromEnvParser('ETHEREAL_MAIL_PORT'),
    auth: {
      USER: getStringFromEnvParser('ETHEREAL_MAIL_USER'),
      PASS: getStringFromEnvParser('ETHEREAL_MAIL_PASSWORD'),
    },
  },

  aws: {
    ACCESS_KEY_ID: getStringFromEnvParser('AWS_ACCESS_KEY_ID'),
    SECRET_ACCESS_KEY: getStringFromEnvParser('AWS_SECRET_ACCESS_KEY'),
    ses: {
      API_VERSION: getIdentityFn('2010-12-01'),
      REGION: getIdentityFn('eu-central-1'),
    },
  },
})
