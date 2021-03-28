import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addFollowUser = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addFollowUser_input', {
        toFollowId: {
          type: tgGraphQLNonNull(tgGraphQLUUID),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'addFollowUser_type',
        fields: () => ({
          startsFollow: {
            type: tgGraphQLBoolean,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedUser: true })(async (args, ctx) => {
      const user = await getRepository(entities.User).findOne({
        where: {
          id: args.input.toFollowId,
        },
      })

      if (!user) {
        throw new Error('User does not exist')
      }

      const followingConnection = await getRepository(entities.Followers).findOne({
        where: {
          followerId: ctx.req.user.id,
          followingId: args.input.toFollowId,
        },
      })

      if (followingConnection) {
        throw new Error('User already follow this user')
      }

      const newFollowing = new entities.Followers()

      newFollowing.followerId = ctx.req.user.id
      newFollowing.followingId = args.input.toFollowId

      const createdFollow = await getRepository(entities.Followers).save(newFollowing)

      return {
        createdFollow,
      }
    })
  )
