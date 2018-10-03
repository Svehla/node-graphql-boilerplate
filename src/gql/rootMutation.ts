import { GraphQLObjectType } from 'graphql'

import UserMutations from './models/User/UserMutations'
import PostMutations from './models/Post/PostMutations'

const rootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...PostMutations,
    ...UserMutations,
  }),
})

export default rootMutation
