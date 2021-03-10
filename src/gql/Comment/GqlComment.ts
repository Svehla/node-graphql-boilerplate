import { graphQLObjectType, gtGraphQLNonNull } from '../../libs/gqlLib/typedGqlTypes'
import { gtGraphQLID, gtGraphQLString } from '../../libs/gqlLib/typedGqlTypes'

export const GqlComment = graphQLObjectType(
  {
    name: 'Comment',
    fields: () => ({
      id: {
        type: gtGraphQLNonNull(gtGraphQLID),
      },
      rawId: {
        type: gtGraphQLID,
      },

      text: {
        type: gtGraphQLString,
      },

      createdAt: {
        type: gtGraphQLString,
      },
      updatedAt: {
        type: gtGraphQLString,
      },
    }),
  },
  {
    id: p => `Comment:${p.id}`,
    rawId: p => p.id,
  }
)
