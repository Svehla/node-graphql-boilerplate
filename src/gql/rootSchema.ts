import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import CreateComment from './models/Comment/mutations/createCommentMutation'
import newComment from './models/Comment/subscriptions/newCommentSubscription'
import { nodeField } from './models/Node/nodeDefinitions'
import CreatePost from './models/Post/mutations/createPostMutation'
import DeletePost from './models/Post/mutations/deletePostMutation'
import UpdatePost from './models/Post/mutations/updatePostMutation'
import PostQuery from './models/Post/PostQuery'
import UserLogin from './models/User/Mutations/UserLoginMutation'
import UserQuery from './models/User/UserQuery'

const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      ...UserQuery,
      ...PostQuery,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      // auth stuffs
      UserLogin,
      CreatePost,
      DeletePost,
      UpdatePost,
      CreateComment,
    }),
  }),
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      ...newComment
    }
  })
})

export default rootSchema
