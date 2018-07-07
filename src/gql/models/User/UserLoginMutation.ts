import { GraphQLNonNull, GraphQLString } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { GraphQLEnumType } from 'graphql'
import {
  GraphQLEmailType,
  GraphQLPasswordType
} from '../../types/index'
import { userLogin } from '../../../services/auth'
import { INVALID_CREDENTIALS } from '../../../constants'


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
      type: new GraphQLNonNull(GraphQLEmailType),
    },
    password: {
      type: new GraphQLNonNull(GraphQLPasswordType),
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
