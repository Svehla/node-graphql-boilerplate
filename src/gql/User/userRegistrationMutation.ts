import { GqlUser } from './GqlUser'
import { User, UserRole } from '../../database/EntityUser'
import { appEnvs } from '../../appConfig'
import { emails } from '../../emails'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLEmail,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLPassword,
  tgGraphQLString,
} from '../../libs/typedGraphQL/typedGqlTypes'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const userRegistrationMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('user_registration_mutation_input', {
        email: {
          type: tgGraphQLNonNull(tgGraphQLEmail),
        },
        password: {
          type: tgGraphQLNonNull(tgGraphQLPassword(3, 20)),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'user_registration_output',
        fields: () => ({
          user: {
            type: GqlUser,
          },
          token: {
            type: tgGraphQLString,
          },
        }),
      }),
    },
    async args => {
      const repository = getRepository(User)

      const userWithInputEmail = await repository.findOne({ where: { email: args.input.email } })

      if (userWithInputEmail) {
        throw new Error('User already exist')
      }

      const userRepository = getRepository(User)
      const user = new User()

      const salt = bcrypt.genSaltSync(10)
      const passwordHash = bcrypt.hashSync(args.input.password, salt)

      const emailVerifyToken = `verify-email-${Math.random()}`

      user.email = args.input.email
      user.password = passwordHash
      user.isEmailVerified = false
      user.verifyEmailToken = emailVerifyToken
      user.role = UserRole.Editor

      await userRepository.save(user)

      await emails.sendVerifyEmail({
        toEmail: user.email,
        verifyEmailToken: user.verifyEmailToken,
      })

      const userPayload = {
        id: user.id,
        email: user.email,
      }

      return {
        user,
        token: jwt.sign(userPayload, appEnvs.auth.JWT_SECRET),
      }
    }
  )
