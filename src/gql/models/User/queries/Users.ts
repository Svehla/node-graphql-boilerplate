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
import UserType from '../UserType'
import models from '../../../../database/core'
import { OrderByUserKey } from '../../../../constants'

const Users = {
  type: connectionDefinitions({
    name: 'UsersTypes',
    nodeType: UserType,
    connectionFields: {
      totalCount: { type: new GraphQLNonNull(GraphQLInt) },
    },
  }).connectionType,
  args: {
    ...connectionArgs,
    orderBy: {
      type: orderByParam(
        `orderByUser`,
        [
          OrderByUserKey.CreatedAt,
          OrderByUserKey.Name,
          OrderByUserKey.Role,
          OrderByUserKey.Email
        ]
      )
    }
  },
  description: `Get all available users`,
  resolve: async (parent, { messageFromDate, orderBy, ...paginationArgs }, ) => {
    const totalCount = await models.User.count()
    const orderBySqlParam = orderBy
      ? orderBy.map(({ order, key }) => [Case.snake(key), order])
      : [['created_at', 'ASC']]

    return connectionToSqlQuery(
      totalCount,
      paginationArgs,
      ({ offset, limit }) => (
        models.User.findAll({
          offset,
          limit,
          order: orderBySqlParam,
        })
      ),
    )
  },
}

export default Users
