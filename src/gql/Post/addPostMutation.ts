import { GqlPost } from './GqlPost'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLLimitedString,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addPostMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addPostMutation_args', {
        text: {
          type: tgGraphQLLimitedString(10, 10000),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'addPostMutation_type',
        fields: () => ({
          post: {
            type: GqlPost,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const postRepository = getRepository(entities.Post)

      const post = new entities.Post()

      post.text = args.input.text
      post.authorId = ctx.req.publicUser.id

      await postRepository.save(post)

      return {
        post,
      }
    })
  )
