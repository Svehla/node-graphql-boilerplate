import { GqlPublicUser } from './GqlPublicUser'
import { authGqlQueryDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphqlSubQueryType,
  gtGraphQLBoolean,
  gtGraphQLID,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'

export const publicUserQueryFields = () =>
  graphqlSubQueryType(
    {
      publicUserViewer: {
        type: GqlPublicUser,
      },
      publicUser: {
        args: {
          id: {
            type: gtGraphQLNonNull(gtGraphQLID),
          },
        },
        type: GqlPublicUser,
      },
      isPublicUserLoggedIn: {
        type: gtGraphQLBoolean,
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

      publicUserViewer: authGqlQueryDecorator({ onlyLogged: true })(async (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return publicUser
      }),

      isPublicUserLoggedIn: (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return Boolean(publicUser)
      },
    }
  )
