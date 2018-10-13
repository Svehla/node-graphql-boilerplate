import * as Case from 'case'
import {
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'
import { connectionDefinitions } from 'graphql-relay'
import models from '../../../database/core'
import orderByParam from '../../gqlUtils/orderByEnumType'
import { connectionPageParams, pageConnectionToSqlQuery } from '../../gqlUtils/pagination'
import PostType from './PostType'

enum OrderByPostKey {
  CreatedAt = 'CreatedAt',
  Text = 'Text',
}

export default {
  posts: {
    type: connectionDefinitions({
      name: 'PostsTypes',
      nodeType: PostType,
      connectionFields: {
        totalCount: { type: new GraphQLNonNull(GraphQLInt) },
      },
    }).connectionType,
    args: {
      first: { type: GraphQLInt, description: 'fake for relay' },
      ...connectionPageParams,
      orderBy: {
        type: orderByParam(`orderByPost`, Object.keys(OrderByPostKey))
      }
    },
    description: `Get all available posts`,
    resolve: async (parent, args) => {
      const { orderBy } = args
      const totalCount = await models.Post.count()
      const orderBySqlParam = orderBy
        ? orderBy.map(({ order, key }) => [Case.snake(key), order])
        : [[OrderByPostKey.CreatedAt, 'ASC']]

      return pageConnectionToSqlQuery(
        totalCount,
        args,
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
}

