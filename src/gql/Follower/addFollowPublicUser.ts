import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLBoolean,
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addFollowPublicUser = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addFollowPublicUser_input', {
        toFollowId: {
          type: tgGraphQLNonNull(tgGraphQLID),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'addFollowPublicUser_type',
        fields: () => ({
          startsFollow: {
            type: tgGraphQLBoolean,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const publicUser = await getRepository(entities.PublicUser).findOne({
        where: {
          id: args.input.toFollowId,
        },
      })

      if (!publicUser) {
        throw new Error('User does not exist')
      }

      const followingConnection = await getRepository(entities.Followers).findOne({
        where: {
          followerId: ctx.req.publicUser.id,
          followingId: args.input.toFollowId,
        },
      })

      if (followingConnection) {
        throw new Error('User already follow this user')
      }

      const newFollowing = new entities.Followers()

      newFollowing.followerId = ctx.req.publicUser.id
      newFollowing.followingId = args.input.toFollowId

      const createdFollow = await getRepository(entities.Followers).save(newFollowing)

      return {
        createdFollow,
      }
    })
  )
