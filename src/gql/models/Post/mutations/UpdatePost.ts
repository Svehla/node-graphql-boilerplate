import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import PostType from '../PostType'
import models from '../../../../database/core'
import { INVALID_CREDENTIALS } from '../../../../errors'
import { POST_NOT_FOUND } from '../errors'

const UpdatePostMutation = mutationWithClientMutationId({
  name: 'UpdatePostMutation',
  description: `this mutation updates a post`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `id of post`
    },
    text: {
      type: new GraphQLNonNull(GraphQLString),
      description: `updated text of post`,
    },
  },
  outputFields: {
    updatedPost: {
      type: PostType,
      description: `return new updated post`,
    },
  },
  mutateAndGetPayload: async ({ text, id }, { req: { user } }) => {
    const { id: convertedId } = fromGlobalId(id)
    if (user) {
      const postsUpdated = await models.Post.update({ text },
        {
          where: {
            id: convertedId
          }
        }
      )
      if (postsUpdated) {
        const updatedPost = await models.Post.findOne({
          where: {
            id: convertedId
          }
        })
        return {
          updatedPost
        }
      } else {
        throw new POST_NOT_FOUND()
      }
    } else {
      throw new INVALID_CREDENTIALS()
    }
  },
})

export default UpdatePostMutation
