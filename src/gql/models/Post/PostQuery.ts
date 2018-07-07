import {
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql'
import {
  connectionDefinitions,
  connectionArgs,
} from 'graphql-relay'
import { connectionToSqlQuery } from 'graphql-cursor-sql-helper'

import PostType from './PostType'
import models from '../../../database/core'

export default {
  posts: {
    type: connectionDefinitions({
      name: 'PostTypes',
      nodeType: PostType,
      connectionFields: {
        totalCount: { type: new GraphQLNonNull(GraphQLInt) },
      },
    }).connectionType,
    args: {
      ...connectionArgs,
      // custom filteres
    },
    description: `Get all available posts`,
    resolve: async (parent, { messageFromDate, ...paginationArgs }) => {
      const totalCount = await models.Post.count()
      return connectionToSqlQuery(
        totalCount,
        paginationArgs,
        ({ offset, limit }) => (
          models.Post.findAll({
            offset,
            limit,
            // TODO: replace it with created at
            // order: [['id', 'DESC']],
          })
        ),
      )
    },
  },
}
