import { tgGraphQLObjectType, tgGraphQLString } from '../../libs/typedGraphQL/index'

export const GqlDynamoItem = tgGraphQLObjectType(
  {
    name: 'DynamoItem',
    fields: () => ({
      PK: {
        type: tgGraphQLString,
      },
      SK: {
        type: tgGraphQLString,
      },
      counter: {
        type: tgGraphQLString,
      },
      active: {
        type: tgGraphQLString,
      },
      session: {
        type: tgGraphQLString,
      },
      TTL: {
        type: tgGraphQLString,
      },
    }),
  },
  {}
)
