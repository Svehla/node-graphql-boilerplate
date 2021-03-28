import { GqlPublicUser } from './GqlPublicUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphqlSubQueryType,
  tgGraphQLBoolean,
  tgGraphQLID,
  tgGraphQLNonNull,
} from '../../libs/typedGraphQL/index'

export const publicUserQueryFields = () =>
  graphqlSubQueryType(
    {
      viewer: {
        type: GqlPublicUser,
      },
      publicUser: {
        args: {
          id: {
            type: tgGraphQLNonNull(tgGraphQLID),
          },
        },
        type: GqlPublicUser,
      },
      isViewerLoggedIn: {
        type: tgGraphQLBoolean,
      },
    },
    {
      publicUser: async args => {
        return getRepository(entities.PublicUser).findOne({
          where: {
            id: args.id,
          },
        })
      },

      viewer: async (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return publicUser
      },

      isViewerLoggedIn: (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return Boolean(publicUser)
      },
    }
  )
