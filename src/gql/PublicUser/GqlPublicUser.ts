import { UserLoginType } from '../../database/EntityPublicUsers'
import {
  tgGraphQLObjectType,
  graphQLSimpleEnum,
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

const GqlUserLoginType = graphQLSimpleEnum(
  'PublicUserLoginTypeEnum',
  // TODO: Object.entries is not working for Typescript enum type
  Object.fromEntries(Object.values(UserLoginType).map(i => [i, i]))
)

export const GqlPublicUser = tgGraphQLObjectType({
  name: 'PublicUser',
  fields: () => ({
    id: {
      type: tgGraphQLNonNull(tgGraphQLID),
    },
    email: {
      type: tgGraphQLString,
    },
    loginType: {
      type: GqlUserLoginType,
    },
    profileImg: {
      type: tgGraphQLString,
    },
  }),
})
