import { GraphQLEnumType } from 'graphql'
import { UserRole } from '../../../../constants'

export default new GraphQLEnumType({
  name: 'GraphQLUserRole',
  values: {
    [UserRole.Admin]: {
      value: UserRole.Admin,
    },
    [UserRole.Editor]: {
      value: UserRole.Editor,
    },
    [UserRole.Author]: {
      value: UserRole.Author,
    },
    [UserRole.Contributor]: {
      value: UserRole.Contributor,
    },
    [UserRole.Subscriber]: {
      value: UserRole.Subscriber,
    },
  },
})

