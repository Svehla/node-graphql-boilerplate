import {
  tgGraphQLInputObjectType,
  tgGraphQLInt,
  tgGraphQLList,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
} from '../../libs/typedGraphQL/index'

export const listPaginationArgs = (name: string) =>
  tgGraphQLNonNull(
    tgGraphQLInputObjectType({
      name: `${name}_pagination`,
      fields: () => ({
        offset: {
          type: tgGraphQLNonNull(tgGraphQLInt),
        },
        limit: {
          type: tgGraphQLNonNull(tgGraphQLInt),
        },
      }),
    })
  )

export const wrapPaginationList = <T>(name: string, type: T) =>
  tgGraphQLObjectType({
    name: `connection_${name}`,
    fields: () => ({
      count: {
        type: tgGraphQLInt,
      },
      items: {
        type: tgGraphQLList(type),
      },
    }),
  })
