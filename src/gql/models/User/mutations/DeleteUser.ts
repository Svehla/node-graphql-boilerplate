import {
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLString,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import models from '../../../../database/core'
import {
  USER_IS_NOT_LOGGED,
  USER_NOT_FOUND
} from '../../../../constants/index'

const PossibleErrors = new GraphQLEnumType({
  name: 'DeleteUserErrors',
  values: {
    USER_IS_NOT_LOGGED: {
      value: USER_IS_NOT_LOGGED,
    },
    USER_NOT_FOUND: {
      value: USER_NOT_FOUND
    }
  },
})

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
    error: {
      type: PossibleErrors,
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

      return deletedRows === 1 ? {
        id
      } : {
        error: USER_NOT_FOUND
      }
    } else {
      return {
        error: USER_IS_NOT_LOGGED,
      }
    }
  },
})

export default DeleteUserMutation
