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
    author: async p => {
      return getRepository(entities.PublicUser).findOne({
        where: {
          id: p.authorId,
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
