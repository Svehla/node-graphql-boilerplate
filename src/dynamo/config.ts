import { appEnvs } from '../appConfig'
import AWS from 'aws-sdk'

AWS.config.update({
  region: appEnvs.aws.REGION,
})

// WTF? is that ok?
export const dynamoDB = new AWS.DynamoDB({ apiVersion: appEnvs.aws.dynamoDB.API_VERSION })

// WTF? is that ok?
export const docClient = new AWS.DynamoDB.DocumentClient()
