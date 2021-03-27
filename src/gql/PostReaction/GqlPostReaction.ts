import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
import { PostReactionType } from '../../database/EntityPostReactions'
import {
  graphQLSimpleEnum,
  lazyCircularDependencyTsHack,
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

export const GqlReactionType = (graphQLSimpleEnum(
  'ReactionTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(PostReactionType).map(i => [i, i]))
) as any) as PostReactionType

export const GqlPostReaction = tgGraphQLObjectType(
  {
    name: 'PostReaction',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      reactionType: {
        type: GqlReactionType,
      },
      authorId: {
        type: tgGraphQLString,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlPublicUser),
      },
    }),
  },
  {
    author: async (p, _a, c) => {
      return c.dataLoaders.user.load(p.authorId)
    },
  }
)
