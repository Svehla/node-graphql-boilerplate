import { GqlComment } from './GqlComment'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLID,
  tgGraphQLLimitedString,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addCommentMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addCommentMutation_args', {
        text: {
          type: tgGraphQLLimitedString(3, 10000),
        },
        postId: {
          type: tgGraphQLNonNull(tgGraphQLID),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'addCommentMutation_type',
        fields: () => ({
          comment: {
            type: GqlComment,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const postRepository = getRepository(entities.Post)
      const post = await postRepository.findOne({ id: args.input.postId })

      if (!post) {
        throw new Error('post does not exist')
      }

      const comment = new entities.Comment()

      comment.authorId = ctx.req.publicUser.id
      comment.text = args.input.text
      comment.postId = args.input.postId

      const commentRepository = getRepository(entities.Comment)
      const createdComment = await commentRepository.save(comment)
      const notification = new entities.Notification()

      notification.receiverId = ctx.req.publicUser.id
      notification.message = 'someone commented your post'
      notification.urlPath = `/posts/${post.id}?commentId=${createdComment.id}`

      const notificationRepository = getRepository(entities.Notification)
      await notificationRepository.save(notification)

      return {
        comment,
      }
    })
  )
