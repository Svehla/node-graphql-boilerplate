import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { gqlAuthMutation } from '../../../../auth/checkPermissions'
import models from '../../../../database/core'
import { PostNotCreatedError } from '../PostErrors'
import PostType from '../PostType'

const CreatePostMutation = mutationWithClientMutationId({
  name: 'CreatePostMutation',
  description: `this mutation create post`,
  inputFields: {
    text: {
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  outputFields: {
    createdPost: {
      type: PostType,
    }
  },
  mutateAndGetPayload: gqlAuthMutation({ onlyLogged: true })(
    async ({ text }, { req: { user } }) => {
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
    }
  ),
})

export default CreatePostMutation
