import { GqlUser } from '../User/GqlUser'
import {
  lazyCircularDependencyTsHack,
  tgGraphQLID,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

export const GqlComment = tgGraphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      rawId: {
        type: tgGraphQLID,
      },

      text: {
        type: tgGraphQLString,
      },

      authorId: {
        type: tgGraphQLInt,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlUser),
      },
      createdAt: {
        type: tgGraphQLString,
      },
      updatedAt: {
        type: tgGraphQLString,
      },
    }),
  },
  {
    id: p => `Comment:${p.id}`,
    rawId: p => p.id,
    author: (p, _a, c) => c.dataLoaders.user.load(p.authorId),
  }
)
