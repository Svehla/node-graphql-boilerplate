import { GqlNotification } from '../Notification/GqlNotification'
import { GqlPost } from '../Post/GqlPost'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { MoreThan } from 'typeorm'
import { UserLoginType } from '../../database/EntityPublicUsers'
import { authGqlTypeDecorator } from '../gqlUtils/gqlAuth'
import { cursorPaginationArgs, cursorPaginationList } from '../gqlUtils/gqlCursorPagination'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLSimpleEnum,
  lazyCircularDependencyTsHack,
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/typedGqlTypes'
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
    posts: async (parent, args) => {
      const repository = getRepository(entities.Post)

      let afterNodeDate = undefined as Date | undefined

      if (args.after) {
        // TODO: add opaque abstraction??? :thinking-face:
        const afterItem = await repository.findOne({ where: { id: args.after } })
        // JS Date vs Postgres Date round shit behavior
        afterItem!.createdAt.setMilliseconds(afterItem!.createdAt.getMilliseconds() + 100)

        afterNodeDate = afterItem?.createdAt
      }

      const [count, posts] = await Promise.all([
        // extract count into custom resolver???
        repository.count(),
        repository.find({
          skip: 0,
          take: args.first,

          ...(afterNodeDate
            ? {
                where: {
                  createdAt: MoreThan(afterNodeDate),
                },
              }
            : {}),
        }),
      ])

      let hasNextPage = false

      if (Array.isArray(posts) && posts.length > 0) {
        const lastSearchedPost = posts[posts.length - 1]
        // JS Date vs Postgres Date round shit behavior
        lastSearchedPost.createdAt.setMilliseconds(
          lastSearchedPost.createdAt.getMilliseconds() + 100
        )
        const restItemsCount = await repository.count({
          where: { createdAt: MoreThan(lastSearchedPost.createdAt) },
        })

        hasNextPage = restItemsCount > 0
      }

      return {
        pageInfo: {
          totalCount: count,
          hasNextPage,
        },
        edges: posts.map(i => ({
          cursor: i.id,
          node: i,
        })),
      }
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
