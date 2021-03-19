import { UserLoginType } from '../../database/EntityPublicUsers'
import {
  graphQLObjectType,
  graphQLSimpleEnum,
  gtGraphQLID,
  gtGraphQLNonNull,
  gtGraphQLString,
} from '../../libs/gqlLib/typedGqlTypes'

const GqlUserLoginType = graphQLSimpleEnum(
  'PublicUserLoginTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserLoginType).map(i => [i, i]))
)

export const GqlPublicUser = graphQLObjectType({
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
  }),
})
