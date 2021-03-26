import { GqlNotification } from '../Notification/GqlNotification'
import { GqlPost } from '../Post/GqlPost'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { LessThanDate, MoreThanDate } from '../../database/utils'
import { MoreThan } from 'typeorm'
import { UserLoginType } from '../../database/EntityPublicUsers'
import { authGqlTypeDecorator } from '../gqlUtils/gqlAuth'
import {
  cursorPaginationArgs,
  cursorPaginationList,
  getSelectAllDataWithCursorByCreatedAt,
} from '../gqlUtils/gqlCursorPagination'
import { entities } from '../../database/entities'
import { format } from 'date-fns'
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
import { offsetPaginationArgs, offsetPaginationList } from '../gqlUtils/gqlOffsetPagination'

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
        args: offsetPaginationArgs('PublicUser_reactions'),
        type: offsetPaginationList('PublicUser_reactions', GqlPostReaction),
      },
      notifications: {
        args: offsetPaginationArgs('PublicUser_notification_args'),
        type: offsetPaginationList('PublicUser_notification', GqlNotification),
      },
      followers: {
        args: offsetPaginationArgs('PublicUser_followers_args'),
        type: offsetPaginationList(
          'PublicUser_followers',
          lazyCircularDependencyTsHack(() => GqlPublicUser)
        ),
      },
      following: {
        args: offsetPaginationArgs('PublicUser_following_args'),
        type: offsetPaginationList(
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
      return getSelectAllDataWithCursorByCreatedAt(entities.Post, args)
    },

    reactions: async (parent, args) => {
      const repository = getRepository(entities.PostReaction)

      const [reactions, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          authorId: parent.id!,
        },
      })

      return {
        count,
        items: reactions,
      }
    },

    notifications: authGqlTypeDecorator({ onlyLoggedPublic: true })(async (parent, args) => {
      const repository = getRepository(entities.Notification)

      const [notifications, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          receiverId: parent.id,
        },
      })

      return {
        count,
        items: notifications,
      }
    }),

    followers: async (parent, args) => {
      const repository = getRepository(entities.Followers)

      const [followers, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          followingId: parent.id!,
        },
      })

      // TODO: add sql join
      const followersUsers = followers.map(i =>
        puRepository.findOne({ where: { id: i.followingId } })
      )

      const puRepository = getRepository(entities.Followers)
      return {
        count,
        items: followersUsers,
      }
    },

    following: async (parent, args) => {
      const repository = getRepository(entities.Followers)

      const [followers, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          followerId: parent.id!,
        },
      })

      const puRepository = getRepository(entities.Followers)

      // TODO: add SQL Join
      const followingUsers = followers.map(i =>
        puRepository.findOne({ where: { id: i.followerId } })
      )

      return {
        count,
        items: followingUsers,
      }
    },
  }
)
