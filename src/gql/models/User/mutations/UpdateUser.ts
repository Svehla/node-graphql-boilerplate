import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import { GraphQLEmail } from 'graphql-custom-types'
import UserType from '../UserType'
import models from '../../../../database/core'
import { NotLoggedError } from '../../../rootErrors'
import { UserNotFoundError } from '../UserErrors'
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
      type: UserType,
      description: `return new updated post`,
    }
  },
  mutateAndGetPayload: async ({ id, ...params }, { req: { user } }) => {
    const { id: convertedId } = fromGlobalId(id)
    if (isNilOrEmpty(user)) {
      throw new NotLoggedError()
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
      throw new UserNotFoundError()
    }

    return {
      updatedUser: updatedUser[1][0]
    }
  },
})

export default UpdateUserMutation
