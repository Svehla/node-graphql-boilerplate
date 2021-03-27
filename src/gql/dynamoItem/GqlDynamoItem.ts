import {
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

export const GqlDynamoItem = tgGraphQLObjectType(
  {
    name: 'DynamoItem',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      name: {
        type: tgGraphQLString,
      },
      authorId: {
        type: tgGraphQLID,
      },
    }),
  },
  {}
)
