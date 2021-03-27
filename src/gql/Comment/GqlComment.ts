import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  lazyCircularDependencyTsHack,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'
import { tgGraphQLID, tgGraphQLString } from '../../libs/typedGraphQL/index'

export const GqlComment = tgGraphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      text: {
        type: tgGraphQLString,
      },
      authorId: {
        type: tgGraphQLID,
      },
      createdAt: {
        type: tgGraphQLString,
      },
      updatedAt: {
        type: tgGraphQLString,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlPublicUser),
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
