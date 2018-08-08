import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql'
import {
  mutationWithClientMutationId,
  fromGlobalId
} from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import PostType from '../PostType'
import models from '../../../../database/core'
import { NotLoggedError } from '../../../rootErrors'
import { PostNotFoundError } from '../PostErrors'

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
    if (isNilOrEmpty(user)) {
      throw new NotLoggedError()
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
      throw new PostNotFoundError()
    }
    return {
      updatedPost: updatedPost[1][0]
    }
  },
})

export default UpdatePostMutation
