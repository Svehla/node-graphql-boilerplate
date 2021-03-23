import { User } from '../../database/EntityUser'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLBoolean,
  gtGraphQLNonNull,
  gtGraphQLString,
} from '../../libs/gqlLib/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'

export const verifyUserEmailMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('Verify_user_input_mutation', {
        verifyToken: {
          type: gtGraphQLNonNull(gtGraphQLString),
        },
      }),
      type: graphQLObjectType({
        name: 'verify_user_email_output',
        fields: () => ({
          isTokenVerified: {
            type: gtGraphQLBoolean,
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
