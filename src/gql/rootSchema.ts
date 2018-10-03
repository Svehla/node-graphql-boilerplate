import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import CreateComment from './models/Comment/Mutations/CreateCommentMutation'
import newComment from './models/Comment/Susbscriptions/newCommentSubscription'
import { nodeField } from './models/Node/nodeDefinitions'
import CreatePost from './models/Post/Mutations/CreatePostMutation'
import DeletePost from './models/Post/Mutations/DeletePostMutation'
import UpdatePost from './models/Post/Mutations/UpdatePostMutation'
import PostQuery from './models/Post/PostQuery'
import UserLogin from './models/User/Mutations/UserLoginMutation'
import UserQuery from './models/User/UserQuery'

const rootSchema = new GraphQLSchema({
  // @ts-ignore
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      ...UserQuery,
      ...PostQuery,
    }),
  }),
  // @ts-ignore
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
  // @ts-ignore
  subscription: new GraphQLObjectType({
    name: 'Subscription',
    fields: {
      ...newComment
    }
  })
})

export default rootSchema
