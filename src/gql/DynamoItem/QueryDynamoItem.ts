import { appEnvs } from '../../appConfig'
import { performance } from 'perf_hooks'
import {
  tgGraphQLBoolean,
  tgGraphQLDateTime,
  tgGraphQLFloat,
  tgGraphQLInt,
  tgGraphQLList,
  tgGraphQLObjectType,
  tgGraphQLString,
  tgGraphqlSubQueryType,
} from '../../libs/typedGraphQL/index'
import AWS from 'aws-sdk'

// https://stackoverflow.com/a/34890276
const groupBy = function (xs: any, key: any) {
  return xs.reduce((rv: any, x: any) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

const GqlSessionType = tgGraphQLObjectType({
  name: 'SessionType',
  fields: () => ({
    expiration: {
      type: tgGraphQLDateTime,
    },
    session: {
      type: tgGraphQLString,
    },
  }),
})

const GqlAccessDay = tgGraphQLObjectType({
  name: 'AccessDay',
  fields: () => ({
    dayId: {
      type: tgGraphQLString,
    },
    dayData: {
      type: tgGraphQLList(
        tgGraphQLObjectType({
          name: 'xxxxxx',
          fields: () => ({
            domain: {
              type: tgGraphQLDateTime,
            },
            counter: {
              type: tgGraphQLInt,
            },
          }),
        })
      ),
    },
  }),
})

export const getQueryDynamoItem = () =>
  tgGraphqlSubQueryType(
    {
      viewerData: {
        type: tgGraphQLObjectType({
          name: 'nwm1',
          fields: () => ({
            time: {
              type: tgGraphQLFloat,
            },
            isUserActive: {
              type: tgGraphQLBoolean,
            },
            sessions: {
              type: tgGraphQLList(GqlSessionType),
            },
            accesses: {
              type: tgGraphQLList(GqlAccessDay),
            },
          }),
        }),
      },
    },
    {
      viewerData: async () => {
        const userIdFromCookie = '1'
        const docClient = new AWS.DynamoDB.DocumentClient()
        const start = performance.now()

        const data = await docClient
          .query({
            TableName: appEnvs.aws.dynamoDB.tableName,

            KeyConditionExpression: '#PK = :PK', // and #SK > :SK
            ExpressionAttributeNames: {
              '#PK': 'PK',
              // '#SK': 'SK',
            },
            ExpressionAttributeValues: {
              ':PK': 'USER#1',
              // ':SK': 'SESSION#',
            },
            ScanIndexForward: true,
          })
          .promise()

        const end = performance.now()
        const time = end - start
        const dt = {
          time,
          isUserActive: data.Items?.find(i => i.SK === `USER#${userIdFromCookie}`)?.active,
          sessions: data.Items?.filter(i => i.SK.startsWith('SESSION#'))?.map(i => ({
            expiration: new Date(i.TTL),
            session: i.session,
          })),
          accesses: Object.entries(
            groupBy(
              data.Items?.filter(i => i.SK.startsWith('ACCESS#'))?.map(i => ({
                userId: i.PK.split('#')[1],
                dayId: i.SK.split('#')[1],
                domain: i.SK.split('#')[2],
                counter: i.counter,
              })),
              'dayId'
            )
          ).map(([dayId, dayData]) => ({
            dayId,
            dayData,
          })),
        }

        console.info(JSON.stringify(dt.accesses, null, 2))
        return dt
      },
    }
  )
