import { GqlPublicUser } from './GqlPublicUser'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLLimitedString,
} from '../../libs/gqlLib/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const updateNickNameMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('updateNickNameMutation_input', {
        newNickName: {
          type: gtGraphQLLimitedString(3, 50),
        },
      }),
      type: graphQLObjectType({
        name: 'updateNickNameMutation_type',
        fields: () => ({
          updatedUser: {
            type: GqlPublicUser,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const publicUser = await getRepository(entities.PublicUser).findOne(ctx.req.publicUser.id)

      publicUser!.nickName = args.input.newNickName

      const updatedUser = await getRepository(entities.PublicUser).save(publicUser!)

      return {
        updatedUser,
      }
    })
  )
