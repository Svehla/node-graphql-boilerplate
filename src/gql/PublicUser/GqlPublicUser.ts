import { GqlNotification } from '../Notification/GqlNotification'
import { GqlPost } from '../Post/GqlPost'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { UserLoginType } from '../../database/EntityPublicUsers'
import { authGqlTypeDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLObjectType,
  graphQLSimpleEnum,
  gtGraphQLID,
  gtGraphQLNonNull,
  gtGraphQLString,
  lazyCircularDependencyTsHack,
} from '../../libs/gqlLib/typedGqlTypes'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

const GqlUserLoginType = graphQLSimpleEnum(
  'PublicUserLoginTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserLoginType).map(i => [i, i]))
)

export const GqlPublicUser = graphQLObjectType(
  {
    name: 'PublicUser',
    fields: () => ({
      id: {
        type: gtGraphQLNonNull(gtGraphQLID),
      },
      nickName: {
        type: gtGraphQLString,
      },
      bio: {
        type: gtGraphQLString,
      },
      loginType: {
        type: GqlUserLoginType,
      },
      profileImg: {
        type: gtGraphQLString,
      },
      posts: {
        args: listPaginationArgs('PublicUser_posts'),
        type: wrapPaginationList('PublicUser_posts', GqlPost),
      },
      reactions: {
        args: listPaginationArgs('PublicUser_reactions'),
        type: wrapPaginationList('PublicUser_reactions', GqlPostReaction),
      },
      notifications: {
        args: listPaginationArgs('PublicUser_notification_args'),
        type: wrapPaginationList('PublicUser_notification', GqlNotification),
      },
      followers: {
        args: listPaginationArgs('PublicUser_followers_args'),
        type: wrapPaginationList(
          'PublicUser_followers',
          lazyCircularDependencyTsHack(() => GqlPublicUser)
        ),
      },
      following: {
        args: listPaginationArgs('PublicUser_following_args'),
        type: wrapPaginationList(
          'PublicUser_following',
          lazyCircularDependencyTsHack(() => GqlPublicUser)
        ),
      },
    }),
  },
  {
    posts: async (parent, args) => {
      const repository = getRepository(entities.Post)

      const [posts, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          authorId: parseInt(parent.id!, 10),
        },
      })

      return {
        count,
        items: posts,
      }
    },

    reactions: async (parent, args) => {
      const repository = getRepository(entities.PostReaction)

      const [reactions, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
        where: {
          authorId: parseInt(parent.id!, 10),
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
          receiverId: parseInt(parent.id!, 10),
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
          followingId: parseFloat(parent.id!),
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
          followerId: parseInt(parent.id!),
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
