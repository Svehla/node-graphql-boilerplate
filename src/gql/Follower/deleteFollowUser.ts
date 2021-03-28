import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const deleteFollowUser = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('deleteFollowUser_input', {
        followingId: {
          type: tgGraphQLNonNull(tgGraphQLString),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'deleteFollowUser_type',
        fields: () => ({
          stopsFollow: {
            type: tgGraphQLBoolean,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedUser: true })(async (args, ctx) => {
      const user = await getRepository(entities.User).findOne({
        where: {
          id: args.input.followingId,
        },
      })
      if (!user) {
        throw new Error('User does not exist')
      }

      const followingConnection = await getRepository(entities.Followers).findOne({
        where: {
          followerId: ctx.req.user.id,
          followingId: args.input.followingId,
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
