import {
  tgGraphQLID,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'

export const GqlComment = tgGraphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: tgGraphQLNonNull(tgGraphQLID),
      },
      rawId: {
        type: tgGraphQLID,
      },

      text: {
        type: tgGraphQLString,
      },

      createdAt: {
        type: tgGraphQLString,
      },
      updatedAt: {
        type: tgGraphQLString,
      },
    }),
  },
  {
    id: p => `Comment:${p.id}`,
    rawId: p => p.id,
  }
)
