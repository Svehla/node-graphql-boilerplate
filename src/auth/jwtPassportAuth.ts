import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as LocalStrategy } from 'passport-local'
import * as TwinBcrypt from 'twin-bcrypt'
import models from '../database/core'

const JWTSecret = process.env.JWT_SECRET
/*
 * init function for passport -> set all strategies
 */
export const setupPassport = () => {
  passport.serializeUser((user: { id: number }, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((user, done) => {
    done(null, user)
  })
  /**
   * implement of login
   */
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      if (!email || !password) {
        return done(null, false)
      }
      try {
        const user = await models.User
          .findOne({ where: { email: email.toLowerCase() } })

        if (!user) {
          return done(null, false)
        }
        const match = TwinBcrypt.compareSync(password, user.password)

        if (!match) {
          done(null, false)
        } else {
          done(null, user)
        }
      } catch (err) {
        return done(err)
      }
    }),
  )

  passport.use(new BearerStrategy(async (token, cb) => {
    if (token) {
      try {
        const decoded = jwt.verify(token, JWTSecret)
        // @ts-ignore
        const id = decoded.id || null
        const findedUser = await models.User.findById(id)
        if (findedUser) {
          cb(null, findedUser)
        } else {
          cb(null, null)
        }
      } catch (err) {
        // console.error(`token is not valid`)
        cb(null, null)
      }
    } else {
      // 'No token provided.'
      return cb(null, null)
    }
  }))
}

export const userLogin = ({ email, password, req }) => (
  new Promise((resolve, reject) => {
    passport.authenticate('local', {session: false}, (err, user) => {
      if (!user) {
        return reject(new Error('Invalid credentials.'))
      }

      if (err) {
        return reject(new Error(err))
      }

      req.login(user, () => {
        const payload = {
          id: user.id.toString(),
          email: user.email,
        }

        const data = {
          user,
          token: jwt.sign(payload, JWTSecret)
        }
        resolve(data)
      })
    })({ body: { email, password } })
  })
)

/**
 * customBearerAuth check if user is logged and if user isn't
 * just doesnt set req.User data but it does not return status 401
 */
export const customBearerAuth = (req, res, next) => {
  passport.authenticate('bearer', {session: false}, (authErr, user) => {
    if (authErr) { return next(authErr) }

    // authentication error
    if (!user) { return next(null) }
    // success
    req.login(user, (loginErr) => {
      if (loginErr) { return next(loginErr) }
      return next()
    })
  })(req, res, next)
}

export const onConnectWssAuth = async (connectionParams, webSocket) => {
  if (connectionParams.token) {
    const decoded = jwt.verify(connectionParams.token, JWTSecret)
    // @ts-ignore
    const id = decoded.id || null
    const findedUser = await models.User.findById(id)
    return { user: findedUser }
  }
}
