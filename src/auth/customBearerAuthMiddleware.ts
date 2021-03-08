import { NextFunction } from 'express'
import { User } from '../database/EntityUser'
import { appEnvs } from '../appEnvs'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'

type DecodedJWT = { email: string; id: string }

// https://github.com/takuya-motoshima/bearer-token-parser/blob/main/src/BearerParser.ts#L6
const REGEX_BEARER_TOKEN = /^Bearer\s+([A-Za-z0-9\-\._~\+\/]+)=*$/

export const customBearerAuth = async (req: any, res: any, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    req.user = null
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

  if (!foundUser) {
    res.status(401).send({ error: 'User not found' })
    return
  }

  req.user = foundUser
  next()
}
