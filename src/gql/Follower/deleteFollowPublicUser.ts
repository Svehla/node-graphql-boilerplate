import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLBoolean,
  gtGraphQLInt,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const deleteFollowPublicUser = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('deleteFollowPublicUser_input', {
        followerId: {
          type: gtGraphQLNonNull(gtGraphQLInt),
        },
      }),
      type: graphQLObjectType({
        name: 'deleteFollowPublicUser_type',
        fields: () => ({
          stopsFollow: {
            type: gtGraphQLBoolean,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const publicUser = await getRepository(entities.PublicUser).findOne({
        where: {
          id: args.input.followerId,
        },
      })
      if (!publicUser) {
        throw new Error('User does not exist')
      }

      const followingConnection = await getRepository(entities.Followers).findOne({
        where: {
          followerId: ctx.req.publicUser.id,
          followingId: args.input.followerId,
        },
      })

      if (!followingConnection) {
        throw new Error('Cant un-follow non follower')
      }

      const createdFollow = await getRepository(entities.Followers).delete(followingConnection.id)

      return {
        createdFollow,
      }
    })
  )
