import {
  graphQLObjectType,
  gtGraphQLInputObjectType,
  gtGraphQLInt,
  gtGraphQLList,
  gtGraphQLNonNull,
} from '../../libs/gqlLib/typedGqlTypes'

export const listPaginationArgs = (name: string) =>
  gtGraphQLNonNull(
    gtGraphQLInputObjectType({
      name: `${name}_pagination`,
      fields: () => ({
        offset: {
          type: gtGraphQLNonNull(gtGraphQLInt),
        },
        limit: {
          type: gtGraphQLNonNull(gtGraphQLInt),
        },
      }),
    })
  )

export const wrapPaginationList = <T>(name: string, type: T) =>
  graphQLObjectType({
    name: `connection_${name}`,
    fields: () => ({
      count: {
        type: gtGraphQLInt,
      },
      items: {
        type: gtGraphQLList(type),
      },
    }),
  })
