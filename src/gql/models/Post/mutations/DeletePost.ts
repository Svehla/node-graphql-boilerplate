import {
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import models from '../../../../database/core'
import {
  USER_IS_NOT_LOGGED,
  POST_NOT_FOUND
} from '../../../../constants/index'

const PossibleErrors = new GraphQLEnumType({
  name: 'DeletePostErrors',
  values: {
    USER_IS_NOT_LOGGED: {
      value: USER_IS_NOT_LOGGED,
    },
    POST_NOT_FOUND: {
      value: POST_NOT_FOUND
    }
  },
})

const DeletePostMutation = mutationWithClientMutationId({
  name: 'DeletePostMutation',
  description: `this mutation deletes post`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `id of post`,
    },
  },
  outputFields: {
    id: {
      type: GraphQLID,
      description: `returns deleted post id`,
    },
    error: {
      type: PossibleErrors,
    },
  },
  mutateAndGetPayload: async ({ id }, { req }) => {
    const user = req.user
    const { id: convertedId } = fromGlobalId(id)

    if (user) {
      const deletedRows = await models.Post.destroy({
        where: {
          id: convertedId
        }
      })

      return deletedRows === 1 ? {
        id
      } : {
        error: POST_NOT_FOUND
      }
    } else {
      return {
        error: USER_IS_NOT_LOGGED,
      }
    }
  },
})

export default DeletePostMutation
