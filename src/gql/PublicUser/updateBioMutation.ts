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

export const updateBioMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('updateBioMutation_input', {
        newBio: {
          type: gtGraphQLLimitedString(3, 50),
        },
      }),
      type: graphQLObjectType({
        name: 'updateBioMutation_type',
        fields: () => ({
          updatedUser: {
            type: GqlPublicUser,
          },
        }),
      }),
    },
    authGqlMutationDecorator({ onlyLoggedPublic: true })(async (args, ctx) => {
      const publicUser = await getRepository(entities.PublicUser).findOne(ctx.req.publicUser.id)

      publicUser!.bio = args.input.newBio

      const updatedUser = await getRepository(entities.PublicUser).save(publicUser!)

      return {
        updatedUser,
      }
    })
  )
