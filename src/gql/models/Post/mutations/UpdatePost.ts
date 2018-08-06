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
import { NOT_LOGGED } from '../../../errors'
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
    if (!user) {
      throw new NOT_LOGGED()
    }

    const updatedPost = await models.Post.update({ text },
      {
        where: {
          id: convertedId
        },
        returning: true
      }
    )

    if (!updatedPost) {
      throw new POST_NOT_FOUND()
    }
    return {
      updatedPost: updatedPost[1][0]
    }
  },
})

export default UpdatePostMutation
