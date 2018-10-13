import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { GraphQLDateTime, GraphQLEmail } from 'graphql-custom-types'
import { toGlobalId } from 'graphql-relay'
import models from '../../../database/core'
import { nodeInterface } from '../Node/nodeDefinitions'
import GraphQLUserRoleType from './types/GraphQLUserRoleType'

export const typeName = 'User'
const userType = new GraphQLObjectType({
  name: typeName,
  // TODO: WTF INTERFACE does not work? but PostType is ok?
  // interfaces: [nodeInterface],
  isTypeOf: obj => obj.__typeOfGqlNode
    ? obj.__typeOfGqlNode === typeName
    // @ts-ignore
    : obj instanceof models.User,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ${typeName}'s global graphQl ID`,
      resolve: _ => toGlobalId(typeName, _.id),
    },
    originalId: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The ${typeName}'s real DB ID`,
      resolve: _ => _.id,
    },
    email: {
      type: GraphQLEmail,
    },
    name: {
      type: GraphQLString,
    },
    role: {
      type: GraphQLUserRoleType,
    },
    createdAt: {
      type: GraphQLDateTime,
      resolve: school => school.created_at
    },
    updatedAt: {
      type: GraphQLDateTime,
      resolve: school => school.updated_at
    },
  }),
})

export default userType
