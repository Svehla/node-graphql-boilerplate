import { GqlCategory } from '../Category/GqlCategory'
import { GqlComment } from '../Comment/GqlComment'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { GqlUser } from '../User/GqlUser'
import {
  cursorPaginationArgs,
  cursorPaginationList,
  getSelectAllDataWithCursorByCreatedAt,
} from '../gqlUtils/gqlCursorPagination'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  lazyCircularDependencyTsHack,
  tgGraphQLDateTime,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'

export const GqlPost = tgGraphQLObjectType(
  {
    name: 'Post',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLUUID),
      },
      name: {
        type: tgGraphQLString,
      },
      text: {
        type: tgGraphQLString,
      },
      authorId: {
        type: tgGraphQLUUID,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlUser),
      },
      commentsCount: {
        type: tgGraphQLInt,
      },
      comments: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('post_comments', GqlComment),
      },
      reactions: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('post_reactions', GqlPostReaction),
      },
      createdAt: {
        type: tgGraphQLDateTime,
      },
      categories: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('post_categories', GqlCategory),
      },
    }),
  },
  {
    author: async (p, _a, c) => {
      return c.dataLoaders.user.load(p.authorId)
    },

    commentsCount: p => {
      return getRepository(entities.Comment).count({
        where: {
          postId: p.id!,
        },
      })
    },

    comments: async (p, a) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Comment, a, {
        where: {
          postId: p.id,
        },
      })
    },

    reactions: async (p, a) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.PostReaction, a, {
        where: {
          postId: p.id,
        },
      })
    },

    categories: async (p, a) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Category, a, {
        where: {
          postId: p.id,
        },
      })
    },
  }
)
