import { PublicUser } from '../database/EntityPublicUsers'
import { Request } from 'express'
import { User } from '../database/EntityUser'

export type DecodedJWT = {
  email: string
  id: string
  login_type: string
}

export type AuthRequest = Request & {
  user?: User
  publicUser?: PublicUser
}
