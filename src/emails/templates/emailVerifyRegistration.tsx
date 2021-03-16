import {
  Column,
  Container,
  Email,
  Header,
  Link,
  PostonentsProvider,
  Row,
  Text,
  renderHtml,
} from 'postonents'
import { appEnvs } from '../../appConfig'
import { sendEmail } from '../sendEmail'
import React from 'react'

type DataProps = {
  toEmail: string
  verifyEmailToken: string
}

// inspiration: https://github.com/Saifadin/postonents/blob/master/examples/VerificationEmail.js
const Template = (props: DataProps) => {
  const verifyUrl = `${appEnvs.adminService.URL}/verify-reg-token/${props.verifyEmailToken}`
  return (
    <PostonentsProvider>
      <Email title={`Verification email for ${props.toEmail}`}>
        <Header
          // eslint-disable-next-line max-len
          logo='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVCB-9vf8hyMuR2cpKqv-xKT99H6Pmz4bEDQ&usqp=CAU'
          logoHeight={50}
          style={{ marginBottom: 24 }}
        />
      </Email>

      <Container alignment='center'>
        <Row>
          <Column small={12}>
            <Text>Hello,</Text>
          </Column>
          <Column small={12} style={{ marginBottom: 24 }}>
            <Text>
              You just registered with the following email: {props.toEmail}. To verify this email
              please click on the link or the text link below.
            </Text>
          </Column>
          <Column small={12} style={{ marginBottom: 24, textAlign: 'center' }}>
            <Link href={verifyUrl} type='primary'>
              Verify your email
            </Link>
          </Column>
          <Column small={12} style={{ marginBottom: 24, textAlign: 'center' }}>
            <Link href={verifyUrl}>{verifyUrl}</Link>
          </Column>
        </Row>
      </Container>
    </PostonentsProvider>
  )
}

export const sendVerifyEmail = async (data: DataProps) => {
  // @ts-expect-error badly typed `renderHtml()` fn
  const template = renderHtml(Template, {
    toEmail: data.toEmail,
    verifyEmailToken: data.verifyEmailToken,
  })

  await sendEmail({
    from: 'svehl.jakub@gmail.com',
    to: data.toEmail,
    subject: 'Verify email',
    html: template,
  })

  return true
}
