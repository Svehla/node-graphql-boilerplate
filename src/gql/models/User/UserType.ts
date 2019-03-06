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
import NodeGqlImplement from '../NodeGqlImplement'

export const typeName = NodeGqlImplement.User
const userType = new GraphQLObjectType({
  name: typeName,
  interfaces: [nodeInterface],
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
    profileImgUrl: {
      type: GraphQLDateTime,
      resolve: school => school.profile_img_url
    },
    updatedAt: {
      type: GraphQLDateTime,
      resolve: school => school.updated_at
    },
  }),
})

export default userType
