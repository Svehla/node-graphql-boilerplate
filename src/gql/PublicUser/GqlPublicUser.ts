import { GqlPost } from '../Post/GqlPost'
import { GqlPostReaction } from '../PostReaction/GqlPostReaction'
import { UserLoginType } from '../../database/EntityPublicUsers'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLObjectType,
  graphQLSimpleEnum,
  gtGraphQLID,
  gtGraphQLNonNull,
  gtGraphQLString,
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
      email: {
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
        type: wrapPaginationList('PublicUser_reactions', gtGraphQLNonNull(GqlPostReaction)),
      },
    }),
  },
  {
    posts: async (_parent, args) => {
      const repository = getRepository(entities.Post)

      const [posts, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
      })

      return {
        count,
        items: posts,
      }
    },

    reactions: async (_parent, args) => {
      const repository = getRepository(entities.User)

      const [users, count] = await repository.findAndCount({
        skip: args.pagination.offset,
        take: args.pagination.limit,
      })

      return {
        count,
        items: users,
      }
    },
  }
)
