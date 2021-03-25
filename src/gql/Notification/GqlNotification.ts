import {
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/typedGqlTypes'
import { tgGraphQLID, tgGraphQLString } from '../../libs/typedGraphQL/typedGqlTypes'

export const GqlNotification = tgGraphQLObjectType({
  name: 'Notification',
  fields: () => ({
    id: {
      type: tgGraphQLNonNull(tgGraphQLID),
    },
    // TODO: add better data structure
    message: {
      type: tgGraphQLString,
    },
    urlPath: {
      type: tgGraphQLString,
    },
    read: {
      type: tgGraphQLBoolean,
    },
    createdAt: {
      type: tgGraphQLString,
    },
    updatedAt: {
      type: tgGraphQLString,
    },
  }),
})
