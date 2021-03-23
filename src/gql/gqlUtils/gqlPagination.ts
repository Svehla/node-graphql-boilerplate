import {
  graphQLObjectType,
  gtGraphQLInputObjectType,
  gtGraphQLInt,
  gtGraphQLList,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'

export const listPaginationArgs = (name: string) => ({
  pagination: {
    type: gtGraphQLNonNull(
      gtGraphQLInputObjectType({
        name: `${name}_args_pagination`,
        fields: () => ({
          offset: {
            type: gtGraphQLNonNull(gtGraphQLInt),
          },
          limit: {
            type: gtGraphQLNonNull(gtGraphQLInt),
          },
        }),
      })
    ),
  },
})

export const wrapPaginationList = <T>(name: string, type: T) =>
  graphQLObjectType({
    name: `connection_${name}_list`,
    fields: () => ({
      count: {
        type: gtGraphQLInt,
      },
      items: {
        type: gtGraphQLList(type),
      },
    }),
  })
