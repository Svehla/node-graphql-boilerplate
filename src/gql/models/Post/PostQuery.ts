import * as Case from 'case'
import {
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'
import { connectionDefinitions, connectionArgs } from 'graphql-relay'
import models from '../../../database/core'
import PostType from './PostType'
import { connectionToSqlQuery } from 'graphql-cursor-sql-helper'

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
    args: connectionArgs,
    description: `Get all available posts`,
    resolve: async (parent, args) => {
      const { orderBy } = args
      const totalCount = await models.Post.count()
      const orderBySqlParam = orderBy
        ? orderBy.map(({ order, key }) => [Case.snake(key), order])
        : [[Case.snake(OrderByPostKey.CreatedAt), 'ASC']]

      return connectionToSqlQuery(
        totalCount,
        args,
        ({ offset, limit }) => {
          return models.Post.findAll({
            offset,
            limit,
            order: orderBySqlParam,
          })
        }
      )
    }
  }
}

