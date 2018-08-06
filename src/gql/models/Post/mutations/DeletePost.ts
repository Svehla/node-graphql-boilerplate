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
import { POST_NOT_FOUND } from '../errors'

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
    }
  },
  mutateAndGetPayload: async ({ id }, { req: { user } }) => {
    const { id: convertedId } = fromGlobalId(id)

    if (user) {
      const deletedRows = await models.Post.destroy({
        where: {
          id: convertedId
        }
      })

      if (deletedRows === 1) {
        return {
          id
        }
      } else {
        throw new POST_NOT_FOUND()
      }
    } else {
      throw new INVALID_CREDENTIALS()
    }
  },
})

export default DeletePostMutation
