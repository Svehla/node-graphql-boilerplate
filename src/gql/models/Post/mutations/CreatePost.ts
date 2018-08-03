import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { INVALID_CREDENTIALS } from '../../../../errors'
import PostType from '../PostType'
import models from '../../../../database/core'

const CreatePostMutation = mutationWithClientMutationId({
  name: 'CreatePostMutation',
  description: `this mutation create post`,
  inputFields: {
    text: {
      type: new GraphQLNonNull(GraphQLString),
      description: `text of post`,
    },
  },
  outputFields: {
    createdPost: {
      type: PostType,
      description: `return new created post`,
    }
  },
  mutateAndGetPayload: async ({ text }, { req }) => {
    const user = req.user
    if (user) {
      const newPost = {
        text,
        user_id: user.id,
      }
      const createdPost = await models.Post.create(newPost)
      return {
        createdPost,
      }
    } else {
      throw new INVALID_CREDENTIALS
    }
  },
})

export default CreatePostMutation
