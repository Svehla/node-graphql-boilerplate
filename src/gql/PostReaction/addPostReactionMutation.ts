import { GqlPostReaction } from './GqlPostReaction'
import { GqlReactionType } from './GqlPostReaction'
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

export const addPostReactionMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addPostReactionMutation_args', {
        text: {
          type: gtGraphQLLimitedString(3, 10000),
        },
        postId: {
          type: gtGraphQLNonNull(gtGraphQLInt),
        },
        reactionType: {
          type: gtGraphQLNonNull(GqlReactionType),
        },
      }),
      type: graphQLObjectType({
        name: 'addPostReactionMutation_type',
        fields: () => ({
          postReaction: {
            type: GqlPostReaction,
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

      const postReactionRepository = getRepository(entities.PostReaction)
      const postReaction = new entities.PostReaction()

      postReaction.authorId = ctx.req.publicUser.id
      postReaction.reactionType = args.input.reactionType
      postReaction.postId = args.input.postId

      await postReactionRepository.save(postReaction)

      return {
        postReaction,
      }
    })
  )
