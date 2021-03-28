import { GqlPost } from '../Post/GqlPost'
import { UserRole } from '../../database/EntityUser'
import { authGqlTypeDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLSimpleEnum,
  tgGraphQLBoolean,
  tgGraphQLID,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

const GqlUserRole = graphQLSimpleEnum(
  'UserRoleEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserRole).map(i => [i, i]))
)

export const GqlUser = tgGraphQLObjectType(
  {
    name: 'User',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      firstName: {
        type: tgGraphQLString,
      },
      email: {
        type: tgGraphQLString,
      },
      age: {
        type: tgGraphQLInt,
      },
      profileImgUrl: {
        type: tgGraphQLString,
      },
      role: {
        type: GqlUserRole,
      },
      isEmailVerified: {
        type: tgGraphQLBoolean,
      },
      posts: {
        args: {
          pagination: {
            type: listPaginationArgs('user_posts_args'),
          },
        },
        type: wrapPaginationList('user_posts', tgGraphQLNonNull(GqlPost)),
      },
    }),
  },
  {
    posts: authGqlTypeDecorator({ allowUserRoles: [UserRole.Admin, UserRole.Editor] })(
      async (p, args) => {
        const repository = getRepository(entities.Post)

        const [posts, count] = await repository.findAndCount({
          skip: args.pagination.offset,
          take: args.pagination.limit,
          where: {
            authorId: parseInt(p.id!, 10),
          },
        })

        return {
          count,
          items: posts,
        }
      }
    ),
  }
)
