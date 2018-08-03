import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import models from '../../../../database/core'
import { INVALID_CREDENTIALS } from '../../../../errors'
import { USER_NOT_FOUND } from '../errors'

const DeleteUserMutation = mutationWithClientMutationId({
  name: 'DeleteUserMutation',
  description: `this mutation deletes user`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `id of user`,
    },
  },
  outputFields: {
    id: {
      type: GraphQLID,
      description: `returns deleted user id`,
    },
  },
  mutateAndGetPayload: async ({ id }, { req: { user } }) => {
    const { id: convertedId } = fromGlobalId(id)
    if (user) {
      const deletedRows = await models.User.destroy({
        where: {
          id: convertedId
        }
      })

      if (deletedRows === 1) {
        return {
          id
        }
      } else {
        throw new USER_NOT_FOUND
      }
    } else {
      throw new INVALID_CREDENTIALS
    }
  },
})

export default DeleteUserMutation
