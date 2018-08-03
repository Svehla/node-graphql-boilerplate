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
import { INVALID_CREDENTIALS } from '../../../../errors'

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
  mutateAndGetPayload: async ({ id }, { req }) => {
    const user = req.user
    const { id: convertedId } = fromGlobalId(id)

    if (user) {
      const deletedRows = await models.Post.destroy({
        where: {
          id: convertedId
        }
      })

      return  {
        id: deletedRows === 1 ? id : null
      }
    } else {
      throw new INVALID_CREDENTIALS
    }
  },
})

export default DeletePostMutation
