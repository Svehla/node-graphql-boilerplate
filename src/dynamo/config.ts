import { appEnvs } from '../appConfig'
import AWS from 'aws-sdk'

export const dynamoDBConf = {
  aws_table_name: appEnvs.aws.dynamoDB.tableName,

  // TODO: add local dynamo table config
  // aws_local_config: {
  //   region: 'local',
  //   endpoint: 'http://localhost:8000',
  // },

  // aws_remote_config: {
  credentials: {
    accessKeyId: appEnvs.aws.ACCESS_KEY_ID,
    secretAccessKey: appEnvs.aws.SECRET_ACCESS_KEY,
    region: appEnvs.aws.REGION,
  },
}

AWS.config.update(dynamoDBConf.credentials)
