import { appEnvs } from '../appConfig'
import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: appEnvs.aws.ACCESS_KEY_ID,
  secretAccessKey: appEnvs.aws.SECRET_ACCESS_KEY,
  region: appEnvs.aws.REGION,
})
