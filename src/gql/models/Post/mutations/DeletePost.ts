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
import { PostNotFoundError } from '../PostErrors'

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

    if (isNilOrEmpty(user)) {
      throw new NotLoggedError()
    }

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
      throw new PostNotFoundError()
    }
  },
})

export default DeletePostMutation
