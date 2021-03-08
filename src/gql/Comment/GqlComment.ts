import { GraphQLID, GraphQLString } from '../../libs/gqlLib/typedGqlTypes'
import { graphQLNonNull, graphQLObjectType } from '../../libs/gqlLib/typedGqlTypes'

export const GqlComment = graphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: graphQLNonNull(GraphQLID),
      },
      rawId: {
        type: GraphQLID,
      },

      text: {
        type: GraphQLString,
      },

      createdAt: {
        type: GraphQLString,
      },
      updatedAt: {
        type: GraphQLString,
      },
    }),
  },
  {
    id: p => `Comment:${p.id}`,
    rawId: p => p.id,
  }
)
