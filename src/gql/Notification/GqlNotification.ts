import {
  graphQLObjectType,
  gtGraphQLBoolean,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'
import { gtGraphQLID, gtGraphQLString } from '../../libs/gqlLib/typedGqlTypes'

export const GqlNotification = graphQLObjectType({
  name: 'Notification',
  fields: () => ({
    id: {
      type: gtGraphQLNonNull(gtGraphQLID),
    },
    // TODO: add better data structure
    message: {
      type: gtGraphQLString,
    },
    urlPath: {
      type: gtGraphQLString,
    },
    read: {
      type: gtGraphQLBoolean,
    },
    createdAt: {
      type: gtGraphQLString,
    },
    updatedAt: {
      type: gtGraphQLString,
    },
  }),
})
