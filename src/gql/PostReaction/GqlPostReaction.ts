import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
import { PostReactionType } from '../../database/EntityPostReactions'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLObjectType,
  graphQLSimpleEnum,
  gtGraphQLID,
  gtGraphQLNonNull,
  gtGraphQLString,
  lazyCircularDependencyTsHack,
} from '../../libs/gqlLib/typedGqlTypes'

export const GqlReactionType = (graphQLSimpleEnum(
  'ReactionTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(PostReactionType).map(i => [i, i]))
) as any) as PostReactionType

export const GqlPostReaction = graphQLObjectType(
  {
    name: 'PostReaction',
    fields: () => ({
      id: {
        type: gtGraphQLNonNull(gtGraphQLID),
      },
      reactionType: {
        type: GqlReactionType,
      },
      publicUserId: {
        type: gtGraphQLString,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlPublicUser),
      },
    }),
  },
  {
    author: async parent => {
      const repository = getRepository(entities.PublicUser)

      if (!parent.publicUserId) {
        return null
      }

      const publicUser = await repository.findOne(parent.publicUserId)

      return publicUser
    },
  }
)
