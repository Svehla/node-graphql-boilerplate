import { Response } from 'express'
import { appConfig } from '../../appConfig'
import { gqlMutation, tgGraphQLString } from '../../libs/typedGraphQL/index'

export const publicUserLogoutMutation = () =>
  gqlMutation(
    {
      args: {},
      type: tgGraphQLString,
    },
    async (_args, ctx) => {
      ;(ctx.res as Response).clearCookie(appConfig.authCookieName, {
        httpOnly: true,
        secure: true,
        // we want to support CORS requests to login
        sameSite: 'none',
      })

      return 'user is successfully logged out'
    }
  )
