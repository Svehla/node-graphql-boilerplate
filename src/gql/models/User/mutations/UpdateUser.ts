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
import { NOT_LOGGED } from '../../../errors'
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
    if (!user) {
      throw new NOT_LOGGED()
    }

    const updatedUser = await models.User.update(
      params,
      {
        where: {
          id: convertedId
        },
        returning: true
      }
    )

    if (!updatedUser) {
      throw new USER_NOT_FOUND()
    }

    return {
      updatedUser: updatedUser[1][0]
    }
  },
})

export default UpdateUserMutation
