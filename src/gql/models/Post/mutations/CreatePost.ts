import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import { NotLoggedError } from '../../../rootErrors'
import { PostNotCreatedError } from '../PostErrors'
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
    if (isNilOrEmpty(user)) {
      throw new NotLoggedError()
    }

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
      throw new PostNotCreatedError({ error })
    }
  },
})

export default CreatePostMutation
