import { AuthRequest, DecodedJWT } from './authAbstraction'
import { NextFunction, Response } from 'express'
import { User } from '../database/EntityUser'
import { appEnvs } from '../appEnvs'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

// https://github.com/takuya-motoshima/bearer-token-parser/blob/main/src/BearerParser.ts#L6
const REGEX_BEARER_TOKEN = /^Bearer\s+([A-Za-z0-9\-\._~\+\/]+)=*$/

export const customBearerAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    req.user = undefined
    next()
    return
  }

  const regExParsedToken = req.headers.authorization?.match(REGEX_BEARER_TOKEN)

  if (!Array.isArray(regExParsedToken)) {
    res.status(500).send({ error: 'Invalid Bearer token' })
    return
  }

  const token = regExParsedToken?.[1]

  let decodedJWT: DecodedJWT

  try {
    decodedJWT = jwt.verify(token, appEnvs.auth.JWT_SECRET) as DecodedJWT
  } catch (err) {
    res.status(500).send({ error: 'Invalid JWT token format' })
    return
  }

  const id = decodedJWT.id
  const repository = getRepository(User)

  const foundUser = await repository.findOne({ where: { id } })

  req.user = foundUser
  next()
}
