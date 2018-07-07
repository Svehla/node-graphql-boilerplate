import { GraphQLSchema } from 'graphql'
import query from './rootQuery'
import mutation from './rootMutation'

const rootSchema = new GraphQLSchema({
  query,
  mutation,
})

export default rootSchema
