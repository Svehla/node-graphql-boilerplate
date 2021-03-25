import {
  tgGraphQLBoolean,
  tgGraphQLInt,
  tgGraphQLList,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/typedGqlTypes'

export const cursorPaginationArgs = () => ({
  // TODO: add forward pagination
  // last: {
  //   type: tgGraphQLInt,
  // },
  // before: {
  //   type: tgGraphQLString,
  // },
  first: {
    // TODO: add positive integer custom scalar type
    type: tgGraphQLNonNull(tgGraphQLInt),
  },
  after: {
    type: tgGraphQLString,
  },
})

export const cursorPaginationList = <T>(name: string, type: T) =>
  tgGraphQLObjectType({
    name: `cursor_connection_${name}`,
    fields: () => ({
      pageInfo: {
        type: tgGraphQLObjectType({
          name: `cursor_connection_${name}_page_info`,
          fields: () => ({
            // TODO: add forward pagination
            // hasPreviousPage: {
            //   type: tgGraphQLBoolean,
            // },
            // endCursor: {
            //   type: tgGraphQLString,
            // },
            totalCount: {
              type: tgGraphQLInt,
            },
            hasNextPage: {
              type: tgGraphQLBoolean,
            },
            startCursor: {
              type: tgGraphQLString,
            },
          }),
        }),
      },
      edges: {
        type: tgGraphQLList(
          tgGraphQLObjectType({
            name: `cursor_connection_${name}_edges`,
            fields: () => ({
              cursor: {
                type: tgGraphQLString,
              },
              node: {
                type: type,
              },
            }),
          })
        ),
      },
    }),
  })
