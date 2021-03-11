import { GqlUser } from './GqlUser'
import { User } from '../../database/EntityUser'
import { appEnvs } from '../../appEnvs'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  graphQLObjectType,
  gtGraphQLEmail,
  gtGraphQLInputObjectType,
  gtGraphQLNonNull,
  gtGraphQLPassword,
  gtGraphQLString,
} from '../../libs/gqlLib/typedGqlTypes'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const userLoginMutation = () =>
  gqlMutation(
    {
      args: {
        input: {
          type: gtGraphQLNonNull(
            gtGraphQLInputObjectType({
              name: 'user_login_mutation_input',
              fields: () => ({
                email: {
                  type: gtGraphQLNonNull(gtGraphQLEmail),
                },
                password: {
                  type: gtGraphQLNonNull(gtGraphQLPassword(6, 50)),
                },
              }),
            })
          ),
        },
      },
      type: graphQLObjectType({
        name: 'user_login_output',
        fields: () => ({
          user: {
            type: GqlUser,
          },
          token: {
            type: gtGraphQLString,
          },
        }),
      }),
    },
    async args => {
      const repository = getRepository(User)

      const user = await repository.findOne({ where: { email: args.input.email } })

      if (!user) {
        throw new Error('Error while login')
      }

      const match = bcrypt.compareSync(args.input.password, user.password)

      if (!match) {
        throw new Error('Error while login')
      }

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
