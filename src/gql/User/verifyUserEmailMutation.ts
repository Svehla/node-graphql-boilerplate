import { User } from '../../database/EntityUser'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLBoolean,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const verifyUserEmailMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('Verify_user_input_mutation', {
        verifyToken: {
          type: tgGraphQLNonNull(tgGraphQLString),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'verify_user_email_output',
        fields: () => ({
          isTokenVerified: {
            type: tgGraphQLBoolean,
          },
        }),
      }),
    },
    async args => {
      const repository = getRepository(User)

      const user = await repository.findOne({ where: { verifyEmailToken: args.input.verifyToken } })

      if (!user) {
        throw new Error('Token does not exist')
      }

      if (user.isEmailVerified) {
        throw new Error('User email is already verified')
      }

      if (args.input.verifyToken !== user.verifyEmailToken) {
        throw new Error('Invalid token')
      }

      const userRepository = getRepository(User)

      await userRepository.update(user.id, { isEmailVerified: true })

      return {
        isTokenVerified: true,
      }
    }
  )
