import { GraphQLNonNull, GraphQLString, GraphQLEnumType, GraphQLID } from 'graphql'
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay'
import PostType from '../PostType'
import models from '../../../../database/core'
import { USER_IS_NOT_LOGGED, POST_NOT_FOUND } from '../../../../constants/index'

const PossibleErrors = new GraphQLEnumType({
  name: 'UpdatePostErrors',
  values: {
    USER_IS_NOT_LOGGED: {
      value: USER_IS_NOT_LOGGED,
    },
  },
})

const UpdatePostMutation = mutationWithClientMutationId({
  name: 'UpdatePostMutation',
  description: `this mutation updates a post`,
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
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
    error: {
      type: PossibleErrors,
    },
  },
  mutateAndGetPayload: async ({ text, id }, { req }) => {
    const user = req.user
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
      }
    } else {
      return {
        error: USER_IS_NOT_LOGGED,
      }
    }
  },
})

export default UpdatePostMutation
