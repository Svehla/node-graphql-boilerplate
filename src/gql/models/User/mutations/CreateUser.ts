import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLEnumType
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import UserType from '../UserType'
import models from '../../../../database/core'
import { GraphQLEmail } from '../../../../../node_modules/graphql-custom-types';
import { UserRole } from '../../../../constants';

const PossibleErrors = new GraphQLEnumType({
  name: 'CreatePostErrors',
  values: {},
})

const CreateUserMutation = mutationWithClientMutationId({
  name: 'CreateUserMutation',
  description: `this mutation creates a user`,
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLEmail),
      description: 'email of the user'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'name of the user'
    },
    role: {
      type: new GraphQLNonNull(UserRole),
      description: ''
    }
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
