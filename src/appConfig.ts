import {
  getNumberFromEnvParser,
  getStringEnumFromEnvParser,
  getStringFromEnvParser,
} from './libs/config/configEnvParsers'
import { validateConfig } from './libs/config/validateConfig'

const urlPattern = '(http|https)://*.' as const

export const appEnvs = validateConfig({
  PORT: getNumberFromEnvParser('PORT'),
  ENVIRONMENT: getStringEnumFromEnvParser('ENVIRONMENT', ['production', 'test', 'dev'] as const),
  NODE_ENV: getStringEnumFromEnvParser('NODE_ENV', ['production', 'development', 'test'] as const),

  postgres: {
    HOST: getStringFromEnvParser('POSTGRES_HOST'),
    USER: getStringFromEnvParser('POSTGRES_USER'),
    DB_NAME: getStringFromEnvParser('POSTGRES_DB_NAME'),
    PASSWORD: getStringFromEnvParser('POSTGRES_PASSWORD'),
    PORT: 5432,
  },

  adminService: {
    URL: getStringFromEnvParser('ADMIN_SERVICE_URL', { pattern: urlPattern }),
  },

  frontOffice: {
    URL: getStringFromEnvParser('FRONT_OFFICE_URL', { pattern: urlPattern }),
  },

  auth: {
    JWT_SECRET: getStringFromEnvParser('JWT_SECRET'),
  },

  etherealMail: {
    HOST: getStringFromEnvParser('ETHEREAL_MAIL_HOST'),
    PORT: getNumberFromEnvParser('ETHEREAL_MAIL_PORT'),
    AUTH_USER: getStringFromEnvParser('ETHEREAL_MAIL_USER'),
    AUTH_PASS: getStringFromEnvParser('ETHEREAL_MAIL_PASSWORD'),
  },

  aws: {
    ACCESS_KEY_ID: getStringFromEnvParser('AWS_ACCESS_KEY_ID'),
    SECRET_ACCESS_KEY: getStringFromEnvParser('AWS_SECRET_ACCESS_KEY'),
    ses: {
      API_VERSION: '2010-12-01',
      REGION: 'eu-central-1',
    },
  },

  google: {
    CLIENT_ID: getStringFromEnvParser('GOOGLE_CLIENT_ID'),
    CLIENT_SECRET: getStringFromEnvParser('GOOGLE_CLIENT_SECRET'),
  },
})

const googleAuthLoginPath = '/auth/google' as const
const googleAuthCallbackPath = '/auth/google/callback' as const

export const appConfig = {
  adminServiceUrl: appEnvs.adminService.URL,
  localGqlEndpoint: `${appEnvs.adminService.URL}/graphql` as const,
  google: {
    authLoginPath: googleAuthLoginPath,
    authCallbackPath: googleAuthCallbackPath,
    authCallbackURL: `${appEnvs.adminService.URL}${googleAuthCallbackPath}` as const,
    loginURL: `${appEnvs.adminService.URL}${googleAuthLoginPath}` as const,
  },
  authCookieName: 'my-custom-auth-cookie' as const,
}
