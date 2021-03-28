import {
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'

export const GqlDynamoItem = tgGraphQLObjectType(
  {
    name: 'DynamoItem',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLUUID),
      },
      name: {
        type: tgGraphQLString,
      },
      authorId: {
        type: tgGraphQLUUID,
      },
    }),
  },
  {}
)
