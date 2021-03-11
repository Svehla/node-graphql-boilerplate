import * as nodemailer from 'nodemailer'
import { appEnvs } from '../appEnvs'
import Mail from 'nodemailer/lib/mailer'
import aws from 'aws-sdk'

const sendRealMail = appEnvs.ENVIRONMENT === 'production'

const nodemailerTransporter = sendRealMail
  ? nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: appEnvs.aws.ses.API_VERSION,
        region: appEnvs.aws.ses.REGION,
      }),
    })
  : nodemailer.createTransport({
      host: appEnvs.etherealMail.HOST,
      port: appEnvs.etherealMail.PORT,
      auth: {
        user: appEnvs.etherealMail.auth.USER,
        pass: appEnvs.etherealMail.auth.PASS,
      },
    })

export const sendEmail = async (emailDefinition: Mail.Options) => {
  await nodemailerTransporter.verify()

  const sendMail = await nodemailerTransporter.sendMail(emailDefinition)

  if (!sendRealMail) {
    console.info(nodemailer.getTestMessageUrl(sendMail))
  }
}
