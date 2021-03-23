import { GqlComment } from './GqlComment'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLInt,
  gtGraphQLLimitedString,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addCommentMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addCommentMutation_args', {
        text: {
          type: gtGraphQLLimitedString(3, 10000),
        },
        postId: {
          // should gql id be string? or number?
          // TODO: create custom ID type?
          type: gtGraphQLNonNull(gtGraphQLInt),
        },
      }),
      type: graphQLObjectType({
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

      const commentRepository = getRepository(entities.Comment)
      const comment = new entities.Comment()

      comment.authorId = ctx.req.publicUser.id
      comment.text = args.input.text
      comment.postId = args.input.postId

      await commentRepository.save(comment)

      return {
        comment,
      }
    })
  )
