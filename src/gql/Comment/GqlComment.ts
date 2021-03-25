import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  lazyCircularDependencyTsHack,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/typedGqlTypes'
import { tgGraphQLID, tgGraphQLString } from '../../libs/typedGraphQL/typedGqlTypes'

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
    author: async p => {
      const repository = getRepository(entities.PublicUser)

      const user = await repository.findOne({
        where: {
          id: p.authorId,
        },
      })

      return user
    },
  }
)
