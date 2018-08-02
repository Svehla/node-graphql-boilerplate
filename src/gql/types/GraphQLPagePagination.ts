import {
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

export default {
  page: {
    type: GraphQLInt,
  },
  rowsPerPage: {
    type: GraphQLInt,
  }
}
