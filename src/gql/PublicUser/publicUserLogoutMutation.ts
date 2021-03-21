import { Response } from 'express'
import { appConfig } from '../../appConfig'
import { gqlMutation, gtGraphQLString } from '../../libs/gqlLib/typedGqlTypes'

export const publicUserLogoutMutation = () =>
  gqlMutation(
    {
      args: {},
      type: gtGraphQLString,
    },
    async (_args, ctx) => {
      ;(ctx.res as Response).clearCookie(appConfig.authCookieName, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })

      return 'user is successfully logged out'
    }
  )
