/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { addUserMutation } from './User/userMutations'
import { userLoginMutation } from './User/userLoginMutations'
import { userQueryFields } from './User/QueryUser'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    // @ts-ignore
    fields: () => ({
      ...userQueryFields(),
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    // @ts-ignore
    fields: () => ({
      addUserMutation: addUserMutation(),
      userLogin: userLoginMutation(),
    }),
  }),
})

export default schema
