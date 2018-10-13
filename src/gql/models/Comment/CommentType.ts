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
import PostType from '../Post/PostType'
import UserType from '../User/UserType'

export const typeName = 'Comment'
export const CommentGlobalIdType = getGlobalIdType(typeName)

const CommentType = new GraphQLObjectType({
  name: typeName,
  // TODO: WTF INTERFACE does not work? but PostType is ok?
  // interfaces: [nodeInterface],
  isTypeOf: obj => obj.__typeOfGqlNode
    ? obj.__typeOfGqlNode === typeName
    // @ts-ignore
    : obj instanceof models.Comment,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The ${typeName}'s global graphQl ID`,
      resolve: reportComment => toGlobalId(typeName, reportComment.id),
    },
    originalId: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The ${typeName}'s real DB ID`,
      resolve: reportComment => reportComment.id,
    },
    text: {
      type: GraphQLString,
    },
    author: {
      type: UserType,
      resolve: async (parent) => {
        return models.User.findById(parent.author_user_id)
      },
    },
    post: {
      type: PostType,
      resolve: async (parent) => {
        return models.Post.findById(parent.post_id)
      },
    },
  }),
})

export default CommentType
