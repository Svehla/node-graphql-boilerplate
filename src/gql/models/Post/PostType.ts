import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { toGlobalId } from 'graphql-relay'
import models from '../../../database/core'
import { getGlobalIdType } from '../../gqlUtils/getGlobalIdType'
import { nodeInterface } from '../Node/nodeDefinitions'
import UserType from '../User/UserType'

export const typeName = 'Post'
export const PostGlobalIdType = getGlobalIdType(typeName)
const PostType = new GraphQLObjectType({
  name: typeName,
  description: ' type definition',
  interfaces: [nodeInterface],
  // @ts-ignore
  isTypeOf: obj => obj.__typeOfGqlNode
    ? obj.__typeOfGqlNode === typeName
    // @ts-ignore
    : obj instanceof models.Post,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ${typeName}'s global graphQl ID`,
      resolve: post => toGlobalId(typeName, post.id),
    },
    originalId: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The Post's real DB ID`,
      resolve: _ => _.id,
    },
    text: {
      type: GraphQLString,
      description: `The Post's text`,
    },
    author: {
      type: UserType,
      resolve: async (parent) => {
        return models.User.findById(parent.user_id)
      },
    },
    createdAt: {
      type: GraphQLString,
      resolve: post => post.created_at
    },
  }),
})

export default PostType
