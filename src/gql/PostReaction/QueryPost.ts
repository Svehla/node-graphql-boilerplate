import { GqlPost } from '../Post/GqlPost'
import {
  cursorPaginationArgs,
  cursorPaginationList,
  getSelectAllDataWithCursorByCreatedAt,
} from '../gqlUtils/gqlCursorPagination'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import { graphqlSubQueryType, tgGraphQLID, tgGraphQLNonNull } from '../../libs/typedGraphQL/index'

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
          ...cursorPaginationArgs(),
          // ...offsetPaginationArgs('query_posts'),
          // TODO: remove author ID param
          // authorId: {
          //   type: tgGraphQLID,
          // },
        },
        type: cursorPaginationList('query_posts', GqlPost),
      },
    },
    {
      posts: async args => {
        return getSelectAllDataWithCursorByCreatedAt(entities.Post, args, {
          // where: {
          //   ...(args.authorId ? { authorId: args.authorId } : {}),
          // },
        })
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
