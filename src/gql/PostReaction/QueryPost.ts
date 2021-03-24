import { GqlPost } from '../Post/GqlPost'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphqlSubQueryType,
  gtGraphQLInt,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

export const postQueryFields = () =>
  graphqlSubQueryType(
    {
      post: {
        args: {
          id: {
            type: gtGraphQLNonNull(gtGraphQLInt),
          },
        },
        type: GqlPost,
      },
      posts: {
        args: {
          ...listPaginationArgs('query_posts'),
          authorId: {
            type: gtGraphQLInt,
          },
        },
        type: wrapPaginationList('query_posts', gtGraphQLNonNull(GqlPost)),
      },
    },
    {
      posts: async args => {
        const repository = getRepository(entities.Post)
        const [posts, count] = await repository.findAndCount({
          skip: args.pagination.offset,
          take: args.pagination.limit,
          where: {
            ...(args.authorId ? { authorId: args.authorId } : {}),
          },
          order: {
            createdAt: 'DESC',
          },
        })

        return {
          count,
          items: posts,
        }
      },

      post: async args => {
        const repository = getRepository(entities.Post)

        const post = await repository.findOne({
          where: {
            id: args.id,
          },
        })

        return post
      },
    }
  )
