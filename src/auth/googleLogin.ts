import { Credentials, OAuth2Client } from 'google-auth-library'
import { Express } from 'express'
import { appConfig, appEnvs } from '../appEnvs'
import axios from 'axios'
import jwt from 'jsonwebtoken'

// Inspiration
// > https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6

const googleConfig = {
  clientId: appEnvs.google.CLIENT_ID,
  clientSecret: appEnvs.google.CLIENT_SECRET,
  redirect: appConfig.google.authCallbackURL,
}

const oAuth2Client = new OAuth2Client(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
)

console.log(googleConfig)

const getGoogleAuthURL = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  })
}

async function getGoogleUser(tokens: Credentials) {
  try {
    // Fetch the user's profile with the access token and bearer
    const googleUserRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    )
    return googleUserRes.data
  } catch (err) {
    console.error('req error', err)
    throw new Error(err.message)
  }
}

export const initGoogleAuthStrategy = (app: Express) => {
  app.get(appConfig.google.authLoginPath, (_req, res) => {
    res.redirect(getGoogleAuthURL())
  })

  app.get(appConfig.google.authCallbackPath, async (req, res) => {
    if (req.query.error) {
      // The user did not give us permission.
      return res.redirect('/google-login-error')
    }
    const code = req.query.code

    // Now that we have the code, use that to acquire tokens.
    const tokensRes = await oAuth2Client.getToken(code as string)
    const u = await getGoogleUser(tokensRes.tokens)

    // const tokenInfo = await oAuth2Client.getTokenInfo(tokensRes.tokens.access_token as string)
    // TODO: save refresh token into database + save user into database

    const token = jwt.sign(
      {
        login_type: 'google',
        ...u,
      },
      appEnvs.auth.JWT_SECRET
    )

    res.cookie(appConfig.authCookieName, token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: false,
    })

    res.redirect('/auth/me')
  })

  // debug endpoint
  app.get('/auth/me', (req, res) => {
    const authCookie = req.cookies[appConfig.authCookieName]

    if (authCookie === undefined) {
      res.send('no cookie provided')
    }

    try {
      const decoded = jwt.verify(authCookie, appEnvs.auth.JWT_SECRET)
      return res.send(decoded)
    } catch (err) {
      res.send(err)
      return
    }
  })
}
