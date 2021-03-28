import { GqlUser } from './GqlUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphqlSubQueryType,
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'

export const userQueryFields = () =>
  graphqlSubQueryType(
    {
      viewer: {
        type: GqlUser,
      },
      user: {
        args: {
          id: {
            type: tgGraphQLNonNull(tgGraphQLUUID),
          },
        },
        type: GqlUser,
      },
      isViewerLoggedIn: {
        type: tgGraphQLBoolean,
      },
    },
    {
      user: async args => {
        return getRepository(entities.User).findOne({
          where: {
            id: args.id,
          },
        })
      },

      viewer: async (_args, ctx) => {
        return ctx.req.user
      },

      isViewerLoggedIn: (_args, ctx) => {
        return Boolean(ctx.req.user)
      },
    }
  )
