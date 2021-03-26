import { GqlComment } from '../Comment/GqlComment'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
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
import { offsetPaginationArgs, offsetPaginationList } from '../gqlUtils/gqlOffsetPagination'

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
        args: offsetPaginationArgs('post_comments'),
        type: offsetPaginationList('post_comments', GqlComment),
      },
      reactions: {
        args: offsetPaginationArgs('post_reactions'),
        type: offsetPaginationList('post_reactions', GqlPostReaction),
      },
      createdAt: {
        type: tgGraphQLDateTime,
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

    comments: async (parent, args) => {
      const repository = getRepository(entities.Comment)

      const [comments, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          postId: parent.id,
        },
        order: {
          createdAt: 'DESC',
        },
      })

      return {
        count,
        items: comments,
      }
    },

    reactions: async (parent, args) => {
      const repository = getRepository(entities.PostReaction)

      const [postReactions, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          postId: parent.id,
        },
        order: {
          createdAt: 'DESC',
        },
      })

      return {
        count,
        items: postReactions,
      }
    },
  }
)
