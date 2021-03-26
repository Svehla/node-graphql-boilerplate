import {
  tgGraphQLInputObjectType,
  tgGraphQLInt,
  tgGraphQLList,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'

export const offsetPaginationArgs = (name: string) => ({
  pagination: {
    type: tgGraphQLNonNull(
      tgGraphQLInputObjectType({
        name: `${name}_args_pagination`,
        fields: () => ({
          offset: {
            type: tgGraphQLNonNull(tgGraphQLInt),
          },
          limit: {
            type: tgGraphQLNonNull(tgGraphQLInt),
          },
        }),
      })
    ),
  },
})

export const offsetPaginationList = <T>(name: string, type: T) =>
  tgGraphQLObjectType({
    name: `connection_${name}_list`,
    fields: () => ({
      count: {
        type: tgGraphQLInt,
      },
      items: {
        type: tgGraphQLList(type),
      },
    }),
  })
