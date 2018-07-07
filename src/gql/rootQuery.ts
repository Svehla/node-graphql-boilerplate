import { GraphQLObjectType } from 'graphql'
import { nodeField } from './models/Node/nodeDefinitions'
import UserQuery from './models/User/UserQuery'
import PostQuery from './models/Post/PostQuery'

const rootFields = {
  node: nodeField,
  ...UserQuery,
  ...PostQuery,
}

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => rootFields,
})

export default rootQuery
