import { GqlNotification } from '../Notification/GqlNotification'
import { GqlPost } from '../Post/GqlPost'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { UserLoginType } from '../../database/EntityPublicUsers'
import { authGqlTypeDecorator } from '../gqlUtils/gqlAuth'
import {
  cursorPaginationArgs,
  cursorPaginationList,
  getSelectAllDataWithCursorByCreatedAt,
} from '../gqlUtils/gqlCursorPagination'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLSimpleEnum,
  lazyCircularDependencyTsHack,
  tgGraphQLID,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

const GqlUserLoginType = graphQLSimpleEnum(
  'PublicUserLoginTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserLoginType).map(i => [i, i]))
)

export const GqlPublicUser = tgGraphQLObjectType(
  {
    name: 'PublicUser',
    fields: () => ({
      id: {
        // use UUID data type?
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      nickName: {
        type: tgGraphQLString,
      },
      bio: {
        type: tgGraphQLString,
      },
      loginType: {
        type: GqlUserLoginType,
      },
      profileImg: {
        type: tgGraphQLString,
      },
      totalPostsCount: {
        type: tgGraphQLInt,
      },
      posts: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('PublicUser_posts', GqlPost),
      },
      reactions: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('PublicUser_reactions', GqlPostReaction),
      },
      notifications: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('PublicUser_notification', GqlNotification),
      },
      followers: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList(
          'PublicUser_followers',
          lazyCircularDependencyTsHack(() => GqlPublicUser)
        ),
      },
      following: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList(
          'PublicUser_following',
          lazyCircularDependencyTsHack(() => GqlPublicUser)
        ),
      },
    }),
  },
  {
    totalPostsCount: async parent => {
      return getRepository(entities.Post).count({
        where: {
          authorId: parent.id!,
        },
      })
    },

    posts: async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Post, args, {
        where: {
          authorId: parent.id!,
        },
      })
    },

    reactions: async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.PostReaction, args, {
        where: {
          authorId: parent.id!,
        },
      })
    },

    notifications: authGqlTypeDecorator({ onlyLoggedPublic: true })(async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Notification, args, {
        where: {
          receiverId: parent.id!,
        },
      })
    }),

    followers: async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Followers, args, {
        where: {
          followingId: parent.id!,
        },
      })
    },

    following: async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Followers, args, {
        where: {
          followerId: parent.id!,
        },
      })
    },
  }
)
