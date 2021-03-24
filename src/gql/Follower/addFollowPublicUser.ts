import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLBoolean,
  gtGraphQLID,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addFollowPublicUser = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addFollowPublicUser_input', {
        followerId: {
          type: gtGraphQLNonNull(gtGraphQLID),
        },
      }),
      type: graphQLObjectType({
        name: 'addFollowPublicUser_type',
        fields: () => ({
          startsFollow: {
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

      if (followingConnection) {
        throw new Error('User already follow this user')
      }

      const newFollowing = new entities.Followers()

      newFollowing.followerId = ctx.req.publicUser.id
      newFollowing.followingId = args.input.followerId

      const createdFollow = await getRepository(entities.Followers).save(newFollowing)

      return {
        createdFollow,
      }
    })
  )
