import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import { GraphQLEmail } from 'graphql-custom-types'
import PostType from '../UserType'
import models from '../../../../database/core'
import { INVALID_CREDENTIALS } from '../../../../errors'
import { USER_NOT_FOUND } from '../errors'
import GraphQLUserRole from '../types/GraphQLUserRole'

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
    }
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
      try {
        const updatedUser = await models.User.findOne({
          where: {
            id: convertedId
          }
        })
        return {
          updatedUser
        }
      } catch (error) {
        throw new USER_NOT_FOUND({ error })
      }
    } else {
      throw new INVALID_CREDENTIALS
    }
  },
})

export default UpdateUserMutation
