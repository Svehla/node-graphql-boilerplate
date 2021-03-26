import {
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'
import { tgGraphQLID, tgGraphQLString } from '../../libs/typedGraphQL/index'

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
