import {
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'
import { tgGraphQLString } from '../../libs/typedGraphQL/index'

export const GqlNotification = tgGraphQLObjectType({
  name: 'Notification',
  fields: () => ({
    id: {
      type: tgGraphQLNonNull(tgGraphQLUUID),
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
