import * as nodemailer from 'nodemailer'
import { appEnvs } from '../appConfig'
import Mail from 'nodemailer/lib/mailer'
import aws from 'aws-sdk'

const sendRealMail = appEnvs.ENVIRONMENT === 'production'

const nodemailerTransporter = sendRealMail
  ? nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: appEnvs.aws.ses.API_VERSION,
        region: appEnvs.aws.REGION,
      }),
    })
  : nodemailer.createTransport({
      host: appEnvs.etherealMail.HOST,
      port: appEnvs.etherealMail.PORT,
      auth: {
        user: appEnvs.etherealMail.AUTH_USER,
        pass: appEnvs.etherealMail.AUTH_PASS,
      },
    })

export const sendEmail = async (emailDefinition: Mail.Options) => {
  await nodemailerTransporter.verify()

  const sendMail = await nodemailerTransporter.sendMail(emailDefinition)

  if (!sendRealMail) {
    console.info(nodemailer.getTestMessageUrl(sendMail))
  }
}
