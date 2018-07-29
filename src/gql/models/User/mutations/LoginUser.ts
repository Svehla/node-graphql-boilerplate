import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { GraphQLEnumType } from 'graphql'
import { GraphQLEmail, GraphQLPassword } from 'graphql-custom-types'
import { userLogin } from '../../../../services/auth'
import { INVALID_CREDENTIALS } from '../../../../constants'


const PossibleErrors = new GraphQLEnumType({
  name: 'UserLoginErrors',
  values: {
    INVALID_CREDENTIALS: {
      value: INVALID_CREDENTIALS,
    },
  },
})


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
    error: {
      type: PossibleErrors
    }
  },
  mutateAndGetPayload: async ({ email, password }, { req }) => {
    try {
      const userLoginData = await userLogin({ email, password, req })
      return userLoginData
    } catch (e) {
      return {
        error: INVALID_CREDENTIALS
      }
    }
  },
})

export default UserLoginMutation