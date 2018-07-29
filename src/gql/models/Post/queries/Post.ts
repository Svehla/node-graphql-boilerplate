import {
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import {
  fromGlobalId
} from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import PostType from '../PostType'
import models from '../../../../database/core'

const Post = {
  type: PostType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Id of post'
    }
  },
  description: `Get post based on params`,
  resolve: async (parent, { id }) => {
    const { id: convertedId } = fromGlobalId(id)
    const post = await models.Post.findOne({
      where: {
        id: convertedId
      }
    })

    return isNilOrEmpty(post) ? null : post
  },
}

export default Post