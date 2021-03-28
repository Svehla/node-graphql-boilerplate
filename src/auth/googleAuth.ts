import { AuthRequest, DecodedJWTSchema } from './authAbstraction'
import { Credentials, OAuth2Client } from 'google-auth-library'
import { Express } from 'express'
import { NextFunction, Response } from 'express'
import { PublicUser, UserLoginType } from '../database/EntityPublicUsers'
import { appConfig, appEnvs } from '../appConfig'
import { getConnection, getRepository } from 'typeorm'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import urljoin from 'url-join'

// Inspiration
// > https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6

const oAuth2Client = new OAuth2Client(
  appEnvs.google.CLIENT_ID,
  appEnvs.google.CLIENT_SECRET,
  appConfig.google.authCallbackURL
)

const getGoogleAuthURL = (callbackOriginURL: string) => {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    state: JSON.stringify({ callbackOriginURL }),
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  })
}

async function getGoogleUser(tokens: Credentials) {
  try {
    // Fetch the user's profile with the access token and bearer
    const googleUserRes = await axios.get<{
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      }
    )
    return googleUserRes.data
  } catch (err) {
    console.error(err)
    throw new Error(err.message)
  }
}
const allowOriginsUrlsHosts = appEnvs.allowedOriginsUrls.map(i => new URL(i)).map(i => i.host)

export const initGoogleAuthStrategy = (app: Express) => {
  app.get(appConfig.google.authLoginPath, (req, res) => {
    const callbackOriginURL = req.get('referer') ?? `${req.protocol}://${req.get('host')}`

    // TODO: add whitelist referer from cors values...
    if (!callbackOriginURL) {
      res.status(400).send('callback URI referer is not setted')
      return
    }
    const cbHost = new URL(callbackOriginURL).host
    // cors does not work there coz this is GET request
    if (!allowOriginsUrlsHosts.includes(cbHost)) {
      res.status(400).send(`callback host ${cbHost} is not supported`)
      return
    }
    res.redirect(getGoogleAuthURL(callbackOriginURL))
  })

  // TODO: POST???
  app.get(appConfig.google.authCallbackPath, async (req, res) => {
    try {
      const state = JSON.parse((req.query.state as string) ?? '{}') as {
        callbackOriginURL?: string
      }
      const callbackOriginURL = state.callbackOriginURL
      if (!callbackOriginURL) {
        res.status(400).send('callback URI state is not setted')
        return
      }

      if (req.query.error) {
        // The user did not give us permission.
        return res.redirect(urljoin(callbackOriginURL, appConfig.google.errorLoginRedirectPath))
      }
      const code = req.query.code

      // Now that we have the code, use that to acquire tokens.
      const tokensRes = await oAuth2Client.getToken(code as string)
      const tokens = tokensRes.tokens
      const user = await getGoogleUser(tokens)

      // create or update inspiration
      // > inspiration: https://stackoverflow.com/a/64549441
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(PublicUser)
        .values({
          externalServiceId: user.id,
          email: user.email,
          loginType: UserLoginType.Google,
          profileImg: user.picture,
          refreshToken: tokens.refresh_token ?? undefined,
        })
        .orUpdate({
          conflict_target: ['externalServiceId'],
          overwrite: ['email', 'loginType', 'refreshToken', 'profileImg'],
        })
        .execute()

      const token = jwt.sign(
        {
          loginType: UserLoginType.Google,
          id: user.id,
          email: user.email,
        },
        appEnvs.auth.JWT_SECRET
      )

      res.cookie(appConfig.authCookieName, token, {
        // TODO: how large should be expiration?
        maxAge: 1000 * 60 * 60 * 12 * 30,
        httpOnly: true,
        secure: true,
        // we want to support CORS requests to login
        sameSite: 'none',
      })
      res.redirect(urljoin(callbackOriginURL, appConfig.google.successLoginRedirectPath))
    } catch (err) {
      console.error(err)
      res.status(500).send(err)
    }
  })
}

export const parseGoogleAuthCookieMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authCookie = req.cookies[appConfig.authCookieName]

  if (authCookie === undefined) {
    next()
    return
  }

  let decodedJWT: ReturnType<typeof DecodedJWTSchema.validateSync>

  try {
    decodedJWT = DecodedJWTSchema.validateSync(jwt.verify(authCookie, appEnvs.auth.JWT_SECRET))
  } catch (err) {
    res.status(500).send({ error: 'Invalid JWT token format' })
    req.publicUser = undefined
    return
  }

  if (decodedJWT.loginType !== UserLoginType.Google) {
    next()
    return
  }

  const id = decodedJWT.id
  const repository = getRepository(PublicUser)

  const foundUser = await repository.findOne({ where: { externalServiceId: id } })

  req.publicUser = foundUser
  next()
}
