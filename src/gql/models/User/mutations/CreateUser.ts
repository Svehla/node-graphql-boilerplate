import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import {
  GraphQLEmail,
  GraphQLPassword
} from 'graphql-custom-types'
import * as moment from 'moment'
import { mutationWithClientMutationId } from 'graphql-relay'
import UserType from '../UserType'
import models from '../../../../database/core'
import { USER_NOT_CREATED } from '../errors'
import GraphQLUserRole from '../types/GraphQLUserRole'
import { NOT_LOGGED } from '../../../errors'

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
    const createdAt = moment().valueOf()
    if (!user) {
      throw new NOT_LOGGED()
    }

    const newUser = {
      email,
      name,
      role,
      password,
      created_at: createdAt
    }
    try {
      const createdUser = await models.User.create(newUser)
      return {
        createdUser
      }
    } catch (error) {
      throw new USER_NOT_CREATED({ error })
    }
  },
})

export default CreateUserMutation
