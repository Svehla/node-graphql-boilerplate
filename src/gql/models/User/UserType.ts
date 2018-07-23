import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInt,
} from 'graphql'
import {
  connectionDefinitions,
  connectionArgs,
} from 'graphql-relay'
import { toGlobalId } from 'graphql-relay'
import { connectionToSqlQuery } from 'graphql-cursor-sql-helper'
import { GraphQLEmail } from 'graphql-custom-types'
import GraphQLUserRole from './types/GraphQLUserRole'
import { nodeInterface } from '../Node/nodeDefinitions'
import models from '../../../database/core'
import PostType from '../Post/PostType'

const userType = new GraphQLObjectType({
  name: 'User',
  interfaces: [nodeInterface],
  // @ts-ignore
  isTypeOf: obj => obj instanceof models.User,
  description: `User entity`,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: `The User's global graphQl ID`,
      resolve: _ => toGlobalId('User', _.id),
    },
    originalId: {
      type: new GraphQLNonNull(GraphQLString),
      description: `The User's real DB ID`,
      resolve: _ => _.id,
    },
    email: {
      type: GraphQLEmail,
      description: `email of user`,
    },
    role: {
      type: GraphQLUserRole,
      description: `role of user`,
    },
    name: {
      type: GraphQLString,
      description: `Name of user`,
    },
    posts: {
      type: connectionDefinitions({
        name: 'UserPostType',
        nodeType: PostType,
        connectionFields: {
          totalCount: { type: new GraphQLNonNull(GraphQLInt) },
        },
      }).connectionType,
      args: connectionArgs,
      description: `Get all available posts`,
      resolve: async (parent, { messageFromDate, ...paginationArgs }) => {
        const sqlCondition = {
          where: {
            user_id: parent.id,
          },
        }
        const totalCount = await models.Post.count(sqlCondition)
        return connectionToSqlQuery(
          totalCount,
          paginationArgs,
          ({ offset, limit }) => (
            models.Post.findAll({
              offset,
              limit,
              ...sqlCondition,
            })
          ),
        )
      },
    },
  }),
})

export default userType
