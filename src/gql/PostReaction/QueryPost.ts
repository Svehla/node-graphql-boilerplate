import { GqlPost } from '../Post/GqlPost'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphqlSubQueryType,
  tgGraphQLID,
  tgGraphQLNonNull,
} from '../../libs/typedGraphQL/typedGqlTypes'
import { offsetPaginationArgs, offsetPaginationList } from '../gqlUtils/gqlOffsetPagination'

export const postQueryFields = () =>
  graphqlSubQueryType(
    {
      post: {
        args: {
          id: {
            type: tgGraphQLNonNull(tgGraphQLID),
          },
        },
        type: GqlPost,
      },
      posts: {
        args: {
          ...offsetPaginationArgs('query_posts'),
          authorId: {
            type: tgGraphQLID,
          },
        },
        type: offsetPaginationList('query_posts', GqlPost),
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
