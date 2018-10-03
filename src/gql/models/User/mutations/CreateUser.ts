import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import {
  GraphQLEmail,
  GraphQLPassword
} from 'graphql-custom-types'
import { isNilOrEmpty } from 'ramda-adjunct'
import * as moment from 'moment'
import { mutationWithClientMutationId } from 'graphql-relay'
import UserType from '../UserType'
import models from '../../../../database/core'
import { UserNotCreatedError } from '../UserErrors'
import GraphQLUserRole from '../types/GraphQLUserRole'
import { NotLoggedError } from '../../../rootErrors'

const CreateUserMutation = mutationWithClientMutationId({
  name: 'CreateUserMutation',
  description: `this mutation creates a user`,
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLEmail),
      description: 'user email'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'user name'
    },
    role: {
      type: new GraphQLNonNull(GraphQLUserRole),
      description: 'user role'
    },
    password: {
      type: new GraphQLNonNull(new GraphQLPassword(3, 20)),
      description: 'user password'
    }
  },
  outputFields: {
    createdUser: {
      type: UserType,
      description: `return new created user`,
    },
  },
  mutateAndGetPayload: async ({ email, name, role, password }, { req: { user } }) => {
    if (isNilOrEmpty(user)) {
      throw new NotLoggedError()
    }

    const newUser = {
      email,
      name,
      role,
      password
    }

    try {
      const createdUser = await models.User.create(newUser)
      return {
        createdUser
      }
    } catch (error) {
      throw new UserNotCreatedError({ error })
    }
  },
})

export default CreateUserMutation
