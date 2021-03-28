import { GqlPostReaction } from './GqlPostReaction'
import { GqlReactionType } from './GqlPostReaction'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLLimitedString,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLUUID,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addPostReactionMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addPostReactionMutation_args', {
        text: {
          type: tgGraphQLLimitedString(3, 10000),
        },
        postId: {
          type: tgGraphQLNonNull(tgGraphQLUUID),
        },
        reactionType: {
          type: tgGraphQLNonNull(GqlReactionType),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'addPostReactionMutation_type',
        fields: () => ({
          postReaction: {
            type: GqlPostReaction,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedUser: true })(async (args, ctx) => {
      const postRepository = getRepository(entities.Post)
      const post = await postRepository.findOne({ id: args.input.postId })

      if (!post) {
        throw new Error('post does not exist')
      }

      const postReactionRepository = getRepository(entities.PostReaction)

      const alreadyCreatedReaction = await postReactionRepository.findOne({
        where: { postId: post.id },
      })

      if (alreadyCreatedReaction) {
        await getRepository(entities.PostReaction).delete(alreadyCreatedReaction.id)
      }

      const postReaction = new entities.PostReaction()

      postReaction.authorId = ctx.req.user.id
      postReaction.reactionType = args.input.reactionType
      postReaction.postId = args.input.postId

      await postReactionRepository.save(postReaction)

      return {
        postReaction,
      }
    })
  )
