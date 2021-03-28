import { GqlUser } from './GqlUser'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLLimitedString,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const updateNickNameMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('updateNickNameMutation_input', {
        newNickName: {
          type: tgGraphQLLimitedString(3, 50),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'updateNickNameMutation_type',
        fields: () => ({
          updatedUser: {
            type: GqlUser,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedUser: true })(async (args, ctx) => {
      const userRepository = getRepository(entities.User)

      const user = await userRepository.findOne(ctx.req.user.id)

      user!.nickName = args.input.newNickName

      const updatedUser = await userRepository.save(user!)

      return {
        updatedUser,
      }
    })
  )
