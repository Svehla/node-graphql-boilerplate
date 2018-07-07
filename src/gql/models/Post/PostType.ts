import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
} from 'graphql'
import { toGlobalId } from 'graphql-relay'
import { nodeInterface } from '../Node/nodeDefinitions'
import models from '../../../database/core'
import UserType from '../User/UserType'

const Post = new GraphQLObjectType({
  name: 'Post',
  description: 'Post type definition',
  // TODO: Add nodeInterface
  interfaces: [nodeInterface],
  // TODO: add isTypeOf -> problem with ts types
  // isTypeOf: obj => obj instanceof models.Post,
  // @ts-ignore
  isTypeOf: obj => obj instanceof models.Post,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The Post's global graphQl ID`,
      resolve: _ => toGlobalId('Post', _.id),
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
      description: `Author of current post`,
      resolve: async (parent) => {
        return models.User.findById(parent.user_id)
      },
    },
  }),
})

export default Post
