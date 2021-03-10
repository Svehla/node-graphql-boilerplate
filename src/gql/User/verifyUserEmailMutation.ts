import { User } from '../../database/EntityUser'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLBoolean,
  gtGraphQLID,
  gtGraphQLInputObjectType,
  gtGraphQLNonNull,
  gtGraphQLString,
} from '../../libs/gqlLib/typedGqlTypes'

export const verifyUserEmailMutation = () =>
  gqlMutation(
    {
      args: {
        input: {
          type: gtGraphQLNonNull(
            gtGraphQLInputObjectType({
              name: 'verify_user_input_mutation',
              fields: () => ({
                userId: {
                  type: gtGraphQLNonNull(gtGraphQLID),
                },
                verifyToken: {
                  type: gtGraphQLNonNull(gtGraphQLString),
                },
              }),
            })
          ),
        },
      },
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

      const user = await repository.findOne({ where: { id: args.input.userId } })

      if (!user) {
        throw new Error('User does not exist')
      }

      if (user.isUserEmailVerified) {
        throw new Error('User email is already verified')
      }

      if (args.input.verifyToken !== user.verifyEmailToken) {
        throw new Error('Invalid token')
      }

      const userRepository = getRepository(User)

      await userRepository.update(args.input.userId, { isUserEmailVerified: true })

      return {
        isTokenVerified: true,
      }
    }
  )
