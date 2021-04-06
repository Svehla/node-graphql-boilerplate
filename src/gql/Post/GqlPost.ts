import { GqlComment } from '../Comment/GqlComment'
import { GqlUser } from '../User/GqlUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  lazyCircularDependencyTsHack,
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

export const GqlPost = tgGraphQLObjectType(
  {
    name: 'Post',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      rawId: {
        type: tgGraphQLID,
      },
      name: {
        type: tgGraphQLString,
      },
      text: {
        type: tgGraphQLString,
      },
      authorId: {
        type: tgGraphQLID,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlUser),
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
    author: (p, _a, c) => c.dataLoaders.user.load(p.authorId),
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
