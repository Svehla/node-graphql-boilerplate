import { GqlUser } from './GqlUser'
import { GraphQLEmail, GraphQLPassword } from 'graphql-custom-types'
import {
  GraphQLString,
  gqlMutation,
  graphQLInputObjectType,
  graphQLNonNull,
  graphQLObjectType,
} from '../../libs/gqlLib/typedGqlTypes'
import { User } from '../../database/EntityUser'
import { appEnvs } from '../../appEnvs'
import { getRepository } from 'typeorm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// async circular dependency
export const userLoginMutation = () =>
  gqlMutation(
    {
      type: graphQLObjectType({
        name: 'user_login_output',
        fields: () => ({
          user: {
            type: GqlUser,
          },
          token: {
            type: GraphQLString,
          },
        }),
      }),
      args: {
        input: {
          type: graphQLNonNull(
            graphQLInputObjectType({
              name: 'user_login_mutation_input',
              fields: () => ({
                email: {
                  type: graphQLNonNull((GraphQLEmail as any) as string),
                },
                password: {
                  type: graphQLNonNull((new GraphQLPassword(3, 20) as any) as string),
                },
              }),
            })
          ),
        },
      },
    },
    async args => {
      const repository = getRepository(User)

      const user = await repository.findOne({ where: { email: args.input.email } })

      if (!user) {
        throw new Error('User does not exists')
      }

      const match = bcrypt.compareSync(args.input.password, user.password)

      if (!match) {
        throw new Error('Invalid password')
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
