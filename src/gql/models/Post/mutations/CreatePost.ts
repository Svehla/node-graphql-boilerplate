import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { INVALID_CREDENTIALS } from '../../../../errors'
import { POST_NOT_CREATED } from '../errors'
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
  mutateAndGetPayload: async ({ text }, { req: { user } }) => {
    if (user) {
      const newPost = {
        text,
        user_id: user.id,
      }
      try {
        const createdPost = await models.Post.create(newPost)
        return {
          createdPost,
        }
      } catch (error) {
        throw new POST_NOT_CREATED({ error })
      }
    } else {
      throw new INVALID_CREDENTIALS()
    }
  },
})

export default CreatePostMutation
