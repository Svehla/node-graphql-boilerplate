import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { addCommentMutation } from './Comment/addCommentMutation'
import { addDynamoItemMutation } from './dynamoItem/addDynamoItemMutation'
import { addFollowUser } from './Follower/addFollowUser'
import { addPostMutation } from './Post/addPostMutation'
import { addPostReactionMutation } from './PostReaction/addPostReactionMutation'
import { categoryQueryFields } from './Category/QueryCategory'
import { deleteFollowUser } from './Follower/deleteFollowUser'
import { getQueryDynamoItem } from './dynamoItem/QueryDynamoItem'
import { postQueryFields } from './Post/QueryPost'
import { updateNickNameMutation } from './User/updateNickNameMutation'
import { userLogoutMutation } from './User/userLogoutMutation'
import { userQueryFields } from './User/QueryUser'
import packageJson from '../../package.json'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    // @ts-ignore
    fields: () => ({
      ...userQueryFields(),
      ...postQueryFields(),
      ...getQueryDynamoItem(),
      ...categoryQueryFields(),
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
      userLogoutMutation: userLogoutMutation(),
      addPostMutation: addPostMutation(),
      addCommentMutation: addCommentMutation(),
      addPostReactionMutation: addPostReactionMutation(),
      addFollowUser: addFollowUser(),
      deleteFollowUser: deleteFollowUser(),
      updateNickNameMutation: updateNickNameMutation(),
      addDynamoItemMutation: addDynamoItemMutation(),
    }),
  }),
})

export default schema
