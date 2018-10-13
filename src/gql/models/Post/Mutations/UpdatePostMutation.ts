import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { gqlAuthMutation } from '../../../../auth/checkPermissions'
import models from '../../../../database/core'
import { PostNotFoundError } from '../PostErrors'
import PostType from '../PostType'
import { PostGlobalIdType } from '../PostType'

const UpdatePostMutation = mutationWithClientMutationId({
  name: 'UpdatePostMutation',
  description: `this mutation updates a post`,
  inputFields: {
    postId: {
      type: new GraphQLNonNull(PostGlobalIdType),
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    updatedPost: {
      type: PostType,
    },
  },
  mutateAndGetPayload: gqlAuthMutation({ onlyLogged: true })(
    async ({ text, postId }, { req: { user } }) => {

      const updatedPost = await models.Post.update(
        { text },
        { where: { id: postId }, returning: true }
      )

      if (!updatedPost) {
        throw new PostNotFoundError()
      }
      return {
        updatedPost: updatedPost[1][0]
      }
    }
  )
})

export default UpdatePostMutation
