import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { GraphQLEmail, GraphQLPassword } from 'graphql-custom-types'
import { userLogin } from '../../../../services/auth'
import { INVALID_CREDENTIALS } from '../../../../errors'


const LoginUserMutation = mutationWithClientMutationId({
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
    }
  },
  mutateAndGetPayload: async ({ email, password }, { req }) => {
    try {
      const userLoginData = await userLogin({ email, password, req })
      return userLoginData
    } catch (e) {
      throw new INVALID_CREDENTIALS
    }
  },
})

export default LoginUserMutation