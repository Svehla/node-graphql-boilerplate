/* eslint-disable @typescript-eslint/no-unused-vars */
import { GqlPost } from '../Post/GqlPost'
import { UserRole } from '../../database/EntityUser'
import { authGqlTypeDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  graphQLObjectType,
  graphQLSimpleEnum,
  gtGraphQLBoolean,
  gtGraphQLID,
  gtGraphQLInt,
  gtGraphQLNonNull,
  gtGraphQLString,
} from '../../libs/gqlLib/typedGqlTypes'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'
import { pipe } from 'ramda'

const GqlUserRole = graphQLSimpleEnum(
  'UserRoleEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserRole).map(i => [i, i]))
)

export const GqlUser = graphQLObjectType(
  {
    name: 'User',
    fields: () => ({
      id: {
        type: gtGraphQLNonNull(gtGraphQLID),
      },
      firstName: {
        type: gtGraphQLString,
      },
      email: {
        type: gtGraphQLString,
      },
      age: {
        type: gtGraphQLInt,
      },
      profileImgUrl: {
        type: gtGraphQLString,
      },
      role: {
        type: GqlUserRole,
      },
      isEmailVerified: {
        type: gtGraphQLBoolean,
      },
      posts: {
        args: {
          pagination: {
            type: listPaginationArgs('user_posts_args'),
          },
        },
        type: wrapPaginationList('user_posts', gtGraphQLNonNull(GqlPost)),
      },
    }),
  },
  {
    posts: pipe(
      authGqlTypeDecorator({ onlyLogged: true }),
      authGqlTypeDecorator({ allowRoles: [UserRole.Admin, UserRole.Editor] })
    )(async (p, args, ctx) => {
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
    }),
  }
)
