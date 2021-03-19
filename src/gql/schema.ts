import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { publicUserQueryFields } from './PublicUser/QueryPublicUser'
import { userLoginMutation } from './User/userLoginMutation'
import { userQueryFields } from './User/QueryUser'
import { userRegistrationMutation } from './User/userRegistrationMutation'
import { verifyUserEmailMutation } from './User/verifyUserEmailMutation'
import packageJson from '../../package.json'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    // @ts-ignore
    fields: () => ({
      ...userQueryFields(),
      ...publicUserQueryFields(),
      appVersion: {
        type: GraphQLString,
        resolve: () => packageJson.version,
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    // @ts-ignore
    fields: () => ({
      userLogin: userLoginMutation(),
      userRegistrationMutation: userRegistrationMutation(),
      verifyUserEmailMutation: verifyUserEmailMutation(),
    }),
  }),
})

export default schema
