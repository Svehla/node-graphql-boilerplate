/* eslint-disable @typescript-eslint/no-unused-vars */
import { GqlComment } from '../Comment/GqlComment'
import { GqlUser } from '../User/GqlUser'
import {
  GraphQLID,
  GraphQLString,
  circularDependencyTsHack,
  graphQLNonNull,
  graphQLObjectType,
} from '../../libs/gqlLib/typedGqlTypes'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

export const GqlPost = graphQLObjectType(
  {
    name: 'Post',
    fields: () => ({
      id: {
        type: graphQLNonNull(GraphQLID),
      },
      rawId: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
      text: {
        type: GraphQLString,
      },
      authorId: {
        type: GraphQLID,
      },
      author: {
        type: circularDependencyTsHack(() => GqlUser),
      },
      comments: {
        args: {
          pagination: {
            type: listPaginationArgs('post_comments'),
          },
        },
        type: wrapPaginationList('post_comments', GqlComment),
      },
    }),
  },
  {
    id: p => `Post:${p.id}`,
    rawId: p => p.id,
    author: async p => {
      const repository = getRepository(entities.User)

      const user = await repository.findOne({
        where: {
          id: p.authorId,
        },
      })

      return user
    },
    comments: async (_p, args) => {
      const repository = getRepository(entities.Comment)

      const [comments, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
      })

      return {
        count,
        items: comments,
      }
    },
  }
)
