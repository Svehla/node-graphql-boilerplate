import { AuthRequest, DecodedJWTSchema } from './authAbstraction'
import { Credentials, OAuth2Client } from 'google-auth-library'
import { Express } from 'express'
import { NextFunction, Response } from 'express'
import { PublicUser, UserLoginType } from '../database/EntityPublicUsers'
import { appConfig, appEnvs } from '../appConfig'
import { getConnection, getRepository } from 'typeorm'
import axios from 'axios'
import jwt from 'jsonwebtoken'

// Inspiration
// > https://tomanagle.medium.com/google-oauth-with-node-js-4bff90180fe6

const oAuth2Client = new OAuth2Client(
  appEnvs.google.CLIENT_ID,
  appEnvs.google.CLIENT_SECRET,
  appConfig.google.authCallbackURL
)

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

export const initGoogleAuthStrategy = (app: Express) => {
  app.get(appConfig.google.authLoginPath, (_req, res) => {
    res.redirect(getGoogleAuthURL())
  })

  app.get(appConfig.google.authCallbackPath, async (req, res) => {
    try {
      if (req.query.error) {
        // The user did not give us permission.
        return res.redirect('/google-login-error')
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
          login_type: UserLoginType.Google,
          id: user.id,
          email: user.email,
        },
        appEnvs.auth.JWT_SECRET
      )

      res.cookie(appConfig.authCookieName, token, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: false,
      })

      res.redirect('/')
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
    return
  }

  if (decodedJWT.login_type !== UserLoginType.Google) {
    next()
    return
  }

  const id = decodedJWT.id
  const repository = getRepository(PublicUser)

  const foundUser = await repository.findOne({ where: { externalServiceId: id } })

  req.publicUser = foundUser
  next()
}
