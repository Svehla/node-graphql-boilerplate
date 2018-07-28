import {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString
} from 'graphql'
import {
  connectionDefinitions,
  connectionArgs,
} from 'graphql-relay'
import { USER_NOT_FOUND } from '../../../../constants'
import PostType from '../PostType'
import models from '../../../../database/core'

const Post = {
  type: PostType,
  args: {
    text: {
      type: GraphQLString,
      description: 'Text that post has to have'
    }
  },
  description: `Get post based on params`,
  resolve: async (parent, { text }) => {
    const satisfiyingUser = models.Post.findOne({
      where: {
        text
      }
    })
    return satisfiyingUser ? {
      satisfiyingUser
    } : {
      error: USER_NOT_FOUND
    }
  },
}

export default Post