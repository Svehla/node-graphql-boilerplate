import { GraphQLObjectType } from 'graphql'
import UserLoginMutation from './models/User/UserLoginMutation'
import CreatePostMutation from './models/Post/CreatePost'

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    CreatePostMutation,
    UserLoginMutation,
  }),
})

export default rootMutation
