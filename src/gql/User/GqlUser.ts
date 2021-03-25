import { UserRole } from '../../database/EntityUser'
import {
  graphQLSimpleEnum,
  tgGraphQLBoolean,
  tgGraphQLID,
  tgGraphQLInt,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/typedGqlTypes'
// import { entities } from '../../database/entities'
// import { getRepository } from 'typeorm'

const GqlUserRole = graphQLSimpleEnum(
  'UserRoleEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserRole).map(i => [i, i]))
)

export const GqlUser = tgGraphQLObjectType({
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
  }),
})
