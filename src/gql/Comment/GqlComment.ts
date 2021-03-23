import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLObjectType,
  gtGraphQLNonNull,
  lazyCircularDependencyTsHack,
} from '../../libs/gqlLib/typedGqlTypes'
import { gtGraphQLID, gtGraphQLString } from '../../libs/gqlLib/typedGqlTypes'

export const GqlComment = graphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: gtGraphQLNonNull(gtGraphQLID),
      },
      text: {
        type: gtGraphQLString,
      },
      authorId: {
        type: gtGraphQLID,
      },
      createdAt: {
        type: gtGraphQLString,
      },
      updatedAt: {
        type: gtGraphQLString,
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
