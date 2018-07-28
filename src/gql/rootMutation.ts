import { GraphQLObjectType } from 'graphql'
import UserLoginMutation from './models/User/UserLoginMutation'
import PostMutations from './models/Post/PostMutations'

console.log(PostMutations)

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...PostMutations,
    UserLoginMutation,
  }),
})

export default rootMutation
