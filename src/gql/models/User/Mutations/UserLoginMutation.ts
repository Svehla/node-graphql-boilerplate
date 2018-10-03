import { GraphQLNonNull, GraphQLString } from 'graphql'
import { GraphQLEmail, GraphQLPassword } from 'graphql-custom-types'
import { mutationWithClientMutationId } from 'graphql-relay'
import { userLogin } from '../../../../auth/jwtPassportAuth'
import { InvalidLoginCredentialsError } from '../userErrors'
import UserType from '../UserType'

const UserLoginMutation = mutationWithClientMutationId({
  name: 'UserLoginMutation',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLEmail),
    },
    password: {
      type: new GraphQLNonNull(new GraphQLPassword(3, 20)),
    },
  },
  outputFields: {
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    user: {
      type: UserType
    }
  },
  mutateAndGetPayload: async ({ email, password }, { req }) => {
    try {
      const userLoginData = await userLogin({ email, password, req })
      return userLoginData
    } catch (e) {
      throw new InvalidLoginCredentialsError()
    }
  },
})

export default UserLoginMutation
