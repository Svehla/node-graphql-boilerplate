import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import models from '../../../../database/core'
import { NOT_LOGGED } from '../../../errors'
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
    if (!user) {
      throw new NOT_LOGGED()
    }

    const deletedRows = await models.User.destroy({
      where: {
        id: convertedId
      }
    })

    if (deletedRows !== 1) {
      throw new USER_NOT_FOUND()
    }

    return {
      id
    }
  },
})

export default DeleteUserMutation
