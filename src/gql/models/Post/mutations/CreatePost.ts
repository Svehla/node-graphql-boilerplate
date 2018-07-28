import { GraphQLNonNull, GraphQLString, GraphQLEnumType } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import PostType from '../PostType'
import models from '../../../../database/core'
import { USER_IS_NOT_LOGGED } from '../../../../constants/index'

const PossibleErrors = new GraphQLEnumType({
  name: 'CreatePostErrors',
  values: {
    USER_IS_NOT_LOGGED: {
      value: USER_IS_NOT_LOGGED,
    },
  },
})

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
    },
    error: {
      type: PossibleErrors,
    },
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
      return {
        error: USER_IS_NOT_LOGGED,
      }
    }
  },
})

export default CreatePostMutation
