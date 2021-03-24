import { GqlComment } from '../Comment/GqlComment'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { GqlPublicUser } from '../PublicUser/GqlPublicUser'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLObjectType,
  gtGraphQLID,
  gtGraphQLNonNull,
  gtGraphQLString,
  lazyCircularDependencyTsHack,
} from '../../libs/gqlLib/typedGqlTypes'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

export const GqlPost = graphQLObjectType(
  {
    name: 'Post',
    fields: () => ({
      id: {
        type: gtGraphQLNonNull(gtGraphQLID),
      },
      name: {
        type: gtGraphQLString,
      },
      text: {
        type: gtGraphQLString,
      },
      authorId: {
        type: gtGraphQLID,
      },
      author: {
        type: lazyCircularDependencyTsHack(() => GqlPublicUser),
      },
      comments: {
        args: listPaginationArgs('post_comments'),
        type: wrapPaginationList('post_comments', GqlComment),
      },
      reactions: {
        args: listPaginationArgs('post_reactions'),
        type: wrapPaginationList('post_reactions', gtGraphQLNonNull(GqlPostReaction)),
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
