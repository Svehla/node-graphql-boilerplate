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
  tgGraphQLBoolean,
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
      amIFollowing: {
        type: tgGraphQLBoolean,
      },
      posts: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('PublicUser_posts', GqlPost),
      },
      reactions: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('PublicUser_reactions', GqlPostReaction),
      },
      notificationsCount: {
        type: tgGraphQLInt,
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

    amIFollowing: async (p, a, c) => {
      // optimization
      if (c.req.publicUser?.id === p.id) {
        return false
      }
      const count = await getRepository(entities.Followers).count({
        where: {
          followerId: c.req.publicUser?.id,
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

    notifications: authGqlTypeDecorator({ onlyLoggedPublic: true })(async (parent, args) => {
      return getSelectAllDataWithCursorByCreatedAt(entities.Notification, args, {
        where: {
          receiverId: parent.id!,
        },
      })
    }),

    notificationsCount: authGqlTypeDecorator({ onlyLoggedPublic: true })(async parent => {
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
