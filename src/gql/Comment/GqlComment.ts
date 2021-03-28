import { GqlUser } from '../User/GqlUser'
import {
  lazyCircularDependencyTsHack,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'

export const GqlComment = tgGraphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLUUID),
      },
      text: {
        type: tgGraphQLString,
      },
      authorId: {
        type: tgGraphQLUUID,
      },
      createdAt: {
        type: tgGraphQLString,
      },
      updatedAt: {
        type: tgGraphQLString,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlUser),
      },
    }),
  },
  {
    author: async (p, _a, c) => {
      const userById = c.dataLoaders.user.load(p.authorId)
      return userById
    },
  }
)
