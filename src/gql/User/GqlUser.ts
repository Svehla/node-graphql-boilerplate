import { GqlNotification } from '../Notification/GqlNotification'
import { GqlPost } from '../Post/GqlPost'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { UserLoginType } from '../../database/EntityUser'
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
  tgGraphQLBoolean,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'

const GqlUserLoginType = graphQLSimpleEnum(
  'UserLoginTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserLoginType).map(i => [i, i]))
)

export const GqlUser = tgGraphQLObjectType(
  {
    name: 'User',
    fields: () => ({
      id: {
        // use UUID data type?
        type: tgGraphQLNonNull(tgGraphQLUUID),
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
      amIFollowing: {
        type: tgGraphQLBoolean,
      },
      posts: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('User_posts', GqlPost),
      },
      reactions: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('User_reactions', GqlPostReaction),
      },
      notificationsCount: {
        type: tgGraphQLInt,
      },
      notifications: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('User_notification', GqlNotification),
      },
      followers: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList(
          'User_followers',
          lazyCircularDependencyTsHack(() => GqlUser)
        ),
      },
      following: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList(
          'User_following',
          lazyCircularDependencyTsHack(() => GqlUser)
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

    amIFollowing: async (p, a, c) => {
      // optimization
      if (c.req.user?.id === p.id) {
        return false
      }
      const count = await getRepository(entities.Followers).count({
        where: {
          followerId: c.req.user?.id,
          followingId: p.id,
        },
      })

      return count === 1
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

    notifications: authGqlTypeDecorator({ onlyLoggedUser: true })(async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Notification, args, {
        where: {
          receiverId: parent.id!,
        },
      })
    }),

    notificationsCount: authGqlTypeDecorator({ onlyLoggedUser: true })(async parent => {
      return getRepository(entities.Post).count({
        where: {
          authorId: parent.id!,
        },
      })
    }),

    followers: async (parent, args, c) => {
      const followingConnections = await getSelectAllDataWithCursorByCreatedAt(
        entities.Followers,
        args,
        {
          where: {
            followingId: parent.id!,
          },
        }
      )

      // hack to omit one table..
      return {
        ...followingConnections,
        edges: followingConnections.edges.map(e => ({
          ...e,
          node: c.dataLoaders.user.load(e.node.followerId),
        })),
      }
    },

    following: async (parent, args, c) => {
      const followingConnections = await getSelectAllDataWithCursorByCreatedAt(
        entities.Followers,
        args,
        {
          where: {
            followerId: parent.id!,
          },
        }
      )

      // hack to omit one table...
      return {
        ...followingConnections,
        edges: followingConnections.edges.map(e => ({
          ...e,
          node: c.dataLoaders.user.load(e.node.followingId),
        })),
      }
    },
  }
)
