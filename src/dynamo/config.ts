import { appEnvs } from '../appConfig'
import AWS from 'aws-sdk'

AWS.config.update({
  // on real AWS lambda all configs are read from env variables
  // injected by lambda environment so we don't need to set then
  ...(appEnvs.ENVIRONMENT === 'dev'
    ? {
        accessKeyId: appEnvs.aws.ACCESS_KEY_ID,
        secretAccessKey: appEnvs.aws.SECRET_ACCESS_KEY,
      }
    : {}),
  region: appEnvs.aws.REGION,
})
