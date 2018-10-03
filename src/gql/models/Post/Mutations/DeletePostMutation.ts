import {
  GraphQLID,
  GraphQLNonNull
} from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { toGlobalId } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import { gqlAuthMutation } from '../../../../auth/checkPermissions'
import models from '../../../../database/core'
import { PostNotFoundError } from '../PostErrors'
import { PostGlobalIdType, typeName as postTypeName } from '../PostType'

const DeletePostMutation = mutationWithClientMutationId({
  name: 'DeletePostMutation',
  description: `this mutation deletes post`,
  inputFields: {
    postId: {
      type: new GraphQLNonNull(PostGlobalIdType),
    },
  },
  outputFields: {
    deletedPostId: {
      type: GraphQLID
    }
  },
  mutateAndGetPayload: gqlAuthMutation({ onlyLogged: true })(
    async ({ postId }) => {
      const postDetail = await models.Post.findById(postId)

      if (isNilOrEmpty(postDetail)) {
        throw new PostNotFoundError()
      }

      const deletedRows = await models.Post.destroy({ where: { id: postId }})

      if (deletedRows === 1) {
        return {
          deletedPostId: toGlobalId(postTypeName, postId),
        }
      } else {
        throw new PostNotFoundError()
      }
    }
  )
})

export default DeletePostMutation
