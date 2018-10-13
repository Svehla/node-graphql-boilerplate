import {
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'

export const connectionPageParams = {
  page: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  rowsPerPage: {
    type: new GraphQLNonNull(GraphQLInt),
  }
}

export interface IPagePaginationArg {
  page: number,
  rowsPerPage: number,
}

export const pageConnectionToSqlQuery = async (
  totalCountMaybePromise,
  args: IPagePaginationArg,
  getDataCb
) => {
  const totalCount = await totalCountMaybePromise
  const { page, rowsPerPage } = args
  const limit = rowsPerPage
  const offset = page * rowsPerPage
  let sqlResult
  // fetch data from database
  if (limit === -1 || limit === 0) {
    sqlResult = []
  } else {
    sqlResult = await getDataCb({ limit, offset })
  }
  const edges = sqlResult.map((row, index) => ({
    cursor: '0',
    node: row
  }))
  return {
    totalCount,
    pageInfo: {
      // if length === 0 than cursors are null => no data provided
      startCursor: '0',
      endCursor: '0',
      hasPreviousPage: false,
      hasNextPage: false
    },
    edges
  }
}
