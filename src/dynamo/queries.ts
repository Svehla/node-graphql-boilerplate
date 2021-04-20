import { appEnvs } from '../appConfig'
import { docClient, dynamoDB } from './config'
import { dynamoDBSchema } from './schema'
import { jh, parseDynID } from '../libs/dynamoDbOrm'

// ORM TODOs:
// - runtime args validation + runtime key name checking validation
// - add group by table-to-schema item
const USER = 'USER' as const
const SESSION = 'SESSION' as const

const getSessionById = async (sessionId: string) => {
  const sessions = await docClient
    .query({
      TableName: appEnvs.aws.dynamoDB.tableName,

      KeyConditionExpression: '#PK = :PK',
      ExpressionAttributeNames: {
        '#PK': 'PK',
      },
      ExpressionAttributeValues: {
        ':PK': jh([SESSION, sessionId]),
      },
    })
    .promise()

  if (sessions.Items?.length === 0) return null
  if (sessions.Items!.length! > 1) throw new Error('inconsistent nosql getSessionById data')

  const schema = dynamoDBSchema['accessPatterns']['SESSION#:sessionId___USER#:userId']

  const session = sessions?.Items?.[0] as typeof schema['attrs']

  return {
    ...session,
    PK: parseDynID(schema.PK, session.PK),
    SK: parseDynID(schema.SK, session.SK),
  }
}

const getAllUserSessions = async (a: { userId: string }) => {
  const sessions = await docClient
    .query({
      TableName: appEnvs.aws.dynamoDB.tableName,

      IndexName: 'GSI1',
      KeyConditionExpression: '#SK = :SK and begins_with(#PK, :PK)',
      ExpressionAttributeNames: {
        '#SK': 'SK',
        '#PK': 'PK',
      },
      ExpressionAttributeValues: {
        ':SK': jh([USER, a.userId]),
        ':PK': SESSION + '#',
      },
    })
    .promise()

  const schema =
    dynamoDBSchema['GSI']['GSI1']['accessPatterns']['USER#:userId___SESSION#:sessionId']

  return (sessions.Items as typeof schema['attrs'][])?.map(i => ({
    ...i,
    PK: parseDynID(schema.PK, i.PK),
    SK: parseDynID(schema.SK, i.SK),
  }))
}

const createUserSession = async (a: {
  sessionId: string
  userId: string
  device: string
  publicId: string
  TTL: number
}) => {
  return dynamoDB
    .putItem({
      TableName: appEnvs.aws.dynamoDB.tableName,
      Item: {
        PK: { S: jh([SESSION, a.sessionId]) },
        SK: { S: jh([USER, a.userId]) },
        device: { S: a.device },
        publicId: { S: a.publicId },
        // TODO: add proper session deletion
        // This should delete session in 2 days I guess, TODO: check it
        TTL: { S: a.TTL.toString() },
      },
    })
    .promise()
}

const deleteUserSession = async (a: { userId: string; sessionId: string }) => {
  return docClient
    .delete({
      TableName: appEnvs.aws.dynamoDB.tableName,
      Key: {
        PK: jh([SESSION, a.sessionId]),
        SK: jh([USER, a.userId]),
      },
    })
    .promise()
}

export const dynamoDbReq = {
  getSessionById,
  createUserSession,
  deleteUserSession,
  getAllUserSessions,
}
