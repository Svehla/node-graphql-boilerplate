import {
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'

export const GqlCategory = tgGraphQLObjectType(
  {
    name: 'Category',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLUUID),
      },
      name: {
        type: tgGraphQLString,
      },
    }),
  },
  {}
)
