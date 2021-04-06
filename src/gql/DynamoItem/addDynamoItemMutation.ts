import { GqlDynamoItem } from './GqlDynamoItem'
import { appEnvs } from '../../appConfig'
import { authGqlMutationDecorator } from '../gqlUtils/gqlAuth'
import {
  gqlMutation,
  tgGraphQLNonNull,
  tgGraphQLObjectType,
  tgGraphQLString,
} from '../../libs/typedGraphQL/index'
import { gqlMutationInputArg } from '../gqlUtils/gqlMutationInputArg'
import AWS from 'aws-sdk'

export const addDynamoItemMutation = () =>
  gqlMutation(
    {
      args: gqlMutationInputArg('addDynamoItemMutation_args', {
        name: {
          type: tgGraphQLNonNull(tgGraphQLString),
        },
      }),
      type: tgGraphQLObjectType({
        name: 'addDynamoItemMutation_type',
        fields: () => ({
          dynamoItem: {
            type: GqlDynamoItem,
          },
        }),
      }),
    },

    authGqlMutationDecorator({ onlyLogged: true })(async (args, ctx) => {
      const user = ctx.req.user!

      const ddb = new AWS.DynamoDB({ apiVersion: appEnvs.aws.dynamoDB.API_VERSION })

      // Call DynamoDB to add the item to the table
      const newItem = {
        id: `${Math.random()}`,
        name: args.input.name,
        authorId: user.id,
      }

      await ddb
        .putItem({
          TableName: appEnvs.aws.dynamoDB.tableName,
          Item: {
            id: { S: newItem.id },
            name: { S: newItem.name },
            authorId: { S: newItem.authorId },
            // TODO: fix types
          } as any,
        })
        .promise()

      return { dynamoItem: newItem }
    })
  )
