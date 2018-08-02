import {
  GraphQLNonNull,
  GraphQLInt
} from 'graphql'
import {
  connectionDefinitions,
  connectionArgs,
} from 'graphql-relay'
import { connectionToSqlQuery } from 'graphql-cursor-sql-helper'
import * as Case from 'case'
import orderByParam from '../../../types/orderByEnumType'
import PostType from '../PostType'
import models from '../../../../database/core'
import { OrderByPostKey } from '../../../../constants'

const Posts = {
  type: connectionDefinitions({
    name: 'PostsTypes',
    nodeType: PostType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: {
    ...connectionArgs,
    orderBy: {
      type: orderByParam(
        `orderByPost`,
        [OrderByPostKey.CreatedAt, OrderByPostKey.Text]
      )
    }
  },
  description: `Get all available posts`,
  resolve: async (parent, { messageFromDate, orderBy, ...paginationArgs }, ) => {
    const totalCount = await models.Post.count()
    const orderBySqlParam = orderBy
      ? orderBy.map(({ order, key }) => [Case.snake(key), order])
      : [['created_at', 'ASC']]

    return connectionToSqlQuery(
      totalCount,
      paginationArgs,
      ({ offset, limit }) => (
        models.Post.findAll({
          offset,
          limit,
          order: orderBySqlParam,
        })
      ),
    )
  },
}

export default Posts