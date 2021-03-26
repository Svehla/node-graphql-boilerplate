import { GqlPublicUser } from './GqlPublicUser'
import { authGqlQueryDecorator } from '../gqlUtils/gqlAuth'
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
        const repository = getRepository(entities.PublicUser)

        const publicUser = await repository.findOne({
          where: {
            id: args.id,
          },
        })

        return publicUser
      },

      viewer: authGqlQueryDecorator({ onlyLogged: true })(async (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return publicUser
      }),

      isViewerLoggedIn: (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return Boolean(publicUser)
      },
    }
  )
