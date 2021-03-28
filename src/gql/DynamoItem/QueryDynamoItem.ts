import { GqlDynamoItem } from './GqlDynamoItem'
import { dynamoDBConf } from '../../dynamo/config'
import { graphqlSubQueryType, tgGraphQLList } from '../../libs/typedGraphQL/index'
import AWS from 'aws-sdk'

export const getQueryDynamoItem = () =>
  graphqlSubQueryType(
    {
      dynamoItems: {
        type: tgGraphQLList(GqlDynamoItem),
      },
    },
    {
      dynamoItems: async () => {
        const docClient = new AWS.DynamoDB.DocumentClient()

        const data = await docClient
          // TODO: add scan with pagination example
          .scan({
            TableName: dynamoDBConf.aws_table_name,
          })
          .promise()

        return data.Items
      },
    }
  )
