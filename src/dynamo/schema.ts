import { DeepWritable } from '../utils/generics'
import { appEnvs } from '../appConfig'
import { dt } from '../libs/dynamoDbOrm'

const dynamoDbSchemaConf = {
  tableName: appEnvs.aws.dynamoDB.tableName,
  delimiter: '#',
  PK: 'PK',
  SK: 'SK',
  accessPatterns: {
    // duplicated access names created by composition of PK+SK
    'USER#:userId___USER#:userId': {
      PK: ['USER', ':userId'],
      SK: ['USER', ':userId'],
      attrs: {
        PK: dt.notNullable(dt.string),
        SK: dt.notNullable(dt.string),
        active: dt.notNullable(dt.boolean),
      },
    },
    'SESSION#:sessionId___USER#:userId': {
      PK: ['SESSION', ':sessionId'],
      SK: ['USER', ':userId'],
      attrs: {
        PK: dt.notNullable(dt.string),
        SK: dt.notNullable(dt.string),
        device: dt.notNullable(dt.string),
        publicId: dt.notNullable(dt.string),
        TTL: dt.notNullable(dt.number),
      },
    },
  },

  GSI: {
    GSI1: {
      PK: 'SK',
      SK: 'PK',
      // duplicated schema => this is possible to calculate from the mainAccess patterns...
      accessPatterns: {
        'USER#:userId___SESSION#:sessionId': {
          PK: ['SESSION', ':sessionId'],
          SK: ['USER', ':userId'],
          attrs: {
            PK: dt.notNullable(dt.string),
            SK: dt.notNullable(dt.string),
            device: dt.notNullable(dt.string),
            publicId: dt.notNullable(dt.string),
            ttl: dt.notNullable(dt.number),
          },
        },
      },
    },
  },
} as const

export const dynamoDBSchema = dynamoDbSchemaConf as DeepWritable<typeof dynamoDbSchemaConf>
