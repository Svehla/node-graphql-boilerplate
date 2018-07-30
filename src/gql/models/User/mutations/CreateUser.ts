import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLEnumType
} from 'graphql'
import {
  GraphQLEmail,
  GraphQLPassword
} from 'graphql-custom-types'
import * as moment from 'moment'
import { mutationWithClientMutationId } from 'graphql-relay'
import UserType from '../UserType'
import models from '../../../../database/core'
import GraphQLUserRole from '../types/GraphQLUserRole'

const NOT_CREATED = 'NOT_CREATED'

const PossibleErrors = new GraphQLEnumType({
  name: 'CreateUserErrors',
  values: {
    NOT_CREATED: {
      value: NOT_CREATED
    }
  },
})

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
    error: {
      type: PossibleErrors,
    },
  },
  mutateAndGetPayload: async ({ email, name, role, password }) => {
    const created_at = moment().valueOf()
    const newUser = {
      email,
      name,
      role,
      password,
      created_at
    }
    try {
      const createdUser = await models.User.create(newUser)
      return {
        createdUser
      }
    } catch (e) {
      return {
        error: NOT_CREATED
      }
    }
  },
})

export default CreateUserMutation
