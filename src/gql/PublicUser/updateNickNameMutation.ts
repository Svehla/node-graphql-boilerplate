import { GqlPublicUser } from './GqlPublicUser'
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
            type: GqlPublicUser,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const publicUserRepository = getRepository(entities.PublicUser)

      const publicUser = await publicUserRepository.findOne(ctx.req.publicUser.id)

      publicUser!.nickName = args.input.newNickName

      const updatedUser = await publicUserRepository.save(publicUser!)

      return {
        updatedUser,
      }
    })
  )