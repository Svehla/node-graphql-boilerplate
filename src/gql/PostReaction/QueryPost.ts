import { GqlPost } from '../Post/GqlPost'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import { graphqlSubQueryType, gtGraphQLID, gtGraphQLNonNull } from '../../libs/gqlLib/typedGqlTypes'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

export const postQueryFields = () =>
  graphqlSubQueryType(
    {
      post: {
        args: {
          id: {
            type: gtGraphQLNonNull(gtGraphQLID),
          },
        },
        type: GqlPost,
      },
      posts: {
        args: listPaginationArgs('query_posts'),
        type: wrapPaginationList('query_posts', gtGraphQLNonNull(GqlPost)),
      },
    },
    {
      posts: async args => {
        const repository = getRepository(entities.Post)

        const [users, count] = await repository.findAndCount({
          skip: args.pagination.offset,
          take: args.pagination.limit,
          order: {
            createdAt: 'DESC',
          },
        })

        return {
          count,
          items: users,
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
