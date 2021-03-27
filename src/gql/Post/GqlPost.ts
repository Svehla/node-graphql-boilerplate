import { GqlComment } from '../Comment/GqlComment'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
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
  tgGraphQLID,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

export const GqlPost = tgGraphQLObjectType(
  {
    name: 'Post',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
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
        type: lazyCircularDependencyTsHack(() => GqlPublicUser),
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
    }),
  },
  {
    author: async (p, _a, c) => {
      return c.dataLoaders.user.load(p.authorId)
    },

    commentsCount: parent => {
      return getRepository(entities.Comment).count({
        where: {
          postId: parent.id!,
        },
      })
    },

    comments: async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Comment, args, {
        where: {
          postId: parent.id,
        },
      })
    },

    reactions: async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.PostReaction, args, {
        where: {
          postId: parent.id,
        },
      })
    },
  }
)
