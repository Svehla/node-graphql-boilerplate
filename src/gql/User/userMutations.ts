import { GqlUser } from './GqlUser'
import {
  GraphQLInt,
  GraphQLString,
  gqlMutation,
  graphQLInputObjectType,
  graphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'
import { User, UserRole } from '../../database/EntityUser'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'

// async circular dependency
export const addUserMutation = () =>
  gqlMutation(
    {
      type: GqlUser,
      args: {
        input: {
          type: graphQLNonNull(
            graphQLInputObjectType({
              name: 'logMutationInput',
              fields: () => ({
                firstName: {
                  type: graphQLNonNull(GraphQLString),
                },
                lastName: {
                  type: graphQLNonNull(GraphQLString),
                },
                age: {
                  type: graphQLNonNull(GraphQLInt),
                },
              }),
            })
          ),
        },
      },
    },
    authGqlMutationDecorator({ allowRoles: [UserRole.Admin] })(async args => {
      const repository = getRepository(User)

      const user = new entities.User()
      user.firstName = args.input.firstName
      user.lastName = args.input.lastName
      user.age = args.input.age

      return repository.save(user)
    })
  )
