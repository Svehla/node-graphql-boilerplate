import { AuthJWTUserLoginType } from '../../database/EntityPublicUsers'
import { DecodedJWTSchemaType } from '../../auth/authAbstraction'
import { ErrorWhileLogin } from './userErrors'
import { GqlUser } from './GqlUser'
import { User } from '../../database/EntityUser'
import { appEnvs } from '../../appConfig'
import { getRepository } from 'typeorm'
import {
  gqlMutation,
  tgGraphQLEmail,
  tgGraphQLInputObjectType,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLPassword,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const userLoginMutation = () =>
  gqlMutation(
    {
      args: {
        input: {
          type: tgGraphQLNonNull(
            tgGraphQLInputObjectType({
              name: 'user_login_mutation_input',
              fields: () => ({
                email: {
                  type: tgGraphQLNonNull(tgGraphQLEmail),
                },
                password: {
                  type: tgGraphQLNonNull(tgGraphQLPassword(6, 50)),
                },
              }),
            })
          ),
        },
      },
      type: tgGraphQLObjectType({
        name: 'user_login_output',
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

      const user = await repository.findOne({ where: { email: args.input.email } })

      if (!user) {
        throw new ErrorWhileLogin()
      }

      const match = bcrypt.compareSync(args.input.password, user.password)

      if (!match) {
        throw new ErrorWhileLogin()
      }

      // TODO: add proper : DecodedJWTSchemaType ts type
      const userPayload = {
        id: user.id.toString(),
        email: user.email,
        loginType: AuthJWTUserLoginType.Custom,
      } as DecodedJWTSchemaType

      return {
        user,
        token: jwt.sign(userPayload, appEnvs.auth.JWT_SECRET),
      }
    }
  )
