import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLEnumType,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import { GraphQLEmail } from 'graphql-custom-types'
import PostType from '../UserType'
import models from '../../../../database/core'
import {
  USER_IS_NOT_LOGGED,
  USER_NOT_FOUND
} from '../../../../constants/index'
import GraphQLUserRole from '../types/GraphQLUserRole'

const PossibleErrors = new GraphQLEnumType({
  name: 'UpdateUserErrors',
  values: {
    USER_IS_NOT_LOGGED: {
      value: USER_IS_NOT_LOGGED,
    },
    USER_NOT_FOUND: {
      value: USER_NOT_FOUND
    }
  },
})

const UpdateUserMutation = mutationWithClientMutationId({
  name: 'UpdateUserMutation',
  description: `this mutation updates a user`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `id of user`
    },
    email: {
      type: GraphQLEmail,
      description: 'email of user'
    },
    name: {
      type: GraphQLString,
      description: 'name of user'
    },
    role: {
      type: GraphQLUserRole,
      description: 'role of user'
    }
  },
  outputFields: {
    updatedUser: {
      type: PostType,
      description: `return new updated post`,
    },
    error: {
      type: PossibleErrors,
    },
  },
  mutateAndGetPayload: async ({ id, ...params }, { req: { user } }) => {
    const { id: convertedId } = fromGlobalId(id)
    if (user) {
      const usersUpdated = await models.User.update({ ...params },
        {
          where: {
            id: convertedId
          }
        }
      )
      if (usersUpdated) {
        const updatedUser = await models.User.findOne({
          where: {
            id: convertedId
          }
        })
        return {
          updatedUser
        }
      } else {
        return {
          error: USER_NOT_FOUND
        }
      }
    } else {
      return {
        error: USER_IS_NOT_LOGGED,
      }
    }
  },
})

export default UpdateUserMutation
