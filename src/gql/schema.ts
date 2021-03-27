import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { addCommentMutation } from './Comment/addCommentMutation'
import { addDynamoItemMutation } from './dynamoItem/addDynamoItemMutation'
import { addFollowPublicUser } from './Follower/addFollowPublicUser'
import { addPostMutation } from './Post/addPostMutation'
import { addPostReactionMutation } from './PostReaction/addPostReactionMutation'
import { deleteFollowPublicUser } from './Follower/deleteFollowPublicUser'
import { getQueryDynamoItem } from './dynamoItem/QueryDynamoItem'
import { postQueryFields } from './PostReaction/QueryPost'
import { publicUserLogoutMutation } from './PublicUser/publicUserLogoutMutation'
import { publicUserQueryFields } from './PublicUser/QueryPublicUser'
import { updateNickNameMutation } from './PublicUser/updateNickNameMutation'
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
      ...postQueryFields(),
      ...getQueryDynamoItem(),
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
      publicUserLogoutMutation: publicUserLogoutMutation(),
      addPostMutation: addPostMutation(),
      addCommentMutation: addCommentMutation(),
      addPostReactionMutation: addPostReactionMutation(),
      addFollowPublicUser: addFollowPublicUser(),
      deleteFollowPublicUser: deleteFollowPublicUser(),
      updateNickNameMutation: updateNickNameMutation(),
      addDynamoItemMutation: addDynamoItemMutation(),
    }),
  }),
})

export default schema
