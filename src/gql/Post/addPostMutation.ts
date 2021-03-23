import { GqlPost } from './GqlPost'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLLimitedString,
} from '../../libs/gqlLib/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const addPostMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addPostMutation_args', {
        text: {
          type: gtGraphQLLimitedString(10, 10000),
        },
      }),
      type: graphQLObjectType({
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
