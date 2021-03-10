import {
  GraphQLInt,
  graphQLInputObjectType,
  graphQLList,
  graphQLNonNull,
  graphQLObjectType,
} from '../../libs/gqlLib/typedGqlTypes'

export const listPaginationArgs = (name: string) =>
  graphQLNonNull(
    graphQLInputObjectType({
      name: `${name}_pagination`,
      fields: () => ({
        offset: {
          type: graphQLNonNull(GraphQLInt),
        },
        limit: {
          type: graphQLNonNull(GraphQLInt),
        },
      }),
    })
  )

export const wrapPaginationList = <T>(name: string, type: T) =>
  graphQLObjectType({
    name: `connection_${name}`,
    fields: () => ({
      count: {
        type: GraphQLInt,
      },
      items: {
        type: graphQLList(type),
      },
    }),
  })
