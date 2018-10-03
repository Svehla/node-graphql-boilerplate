import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { gqlAuthMutation } from '../../../../auth/checkPermissions'
import models from '../../../../database/core'
import pubsub from '../../../publicSubscription'
import { PostGlobalIdType } from '../../Post/PostType'
import CommentType from '../CommentType'
import { SubsTypes } from '../Susbscriptions/newCommentSubscription'

const CreateReportCommentMutation = mutationWithClientMutationId({
  name: 'CreateReportCommentMutation',
  inputFields: {
    postId: {
      type: new GraphQLNonNull(PostGlobalIdType),
    },
    commentText: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    createdComment: {
      type: CommentType,
    },
  },
  mutateAndGetPayload: gqlAuthMutation({ onlyLogged: true })(
    async ({ postId, commentText }, { req: { user } }) => {

      const newComment = {
        author_user_id: user.id,
        post_id: postId,
        text: commentText
      }

      const createdComment = await models.Comment.build(newComment).save()
      pubsub.publish(SubsTypes.NewComment, createdComment)
      return {
        createdComment
      }
    },
  )
})

export default CreateReportCommentMutation

