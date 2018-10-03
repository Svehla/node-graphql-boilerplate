import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import models from '../../../../database/core'
import { NotLoggedError } from '../../../rootErrors'
import { UserNotFoundError } from '../UserErrors'

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
    if (isNilOrEmpty(user)) {
      throw new NotLoggedError()
    }

    const deletedRows = await models.User.destroy({
      where: {
        id: convertedId
      }
    })

    if (deletedRows !== 1) {
      throw new UserNotFoundError()
    }

    return {
      id
    }
  },
})

export default DeleteUserMutation
