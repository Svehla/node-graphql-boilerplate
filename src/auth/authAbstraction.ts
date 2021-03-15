import * as yup from 'yup'
import { AuthJWTUserLoginType, PublicUser } from '../database/EntityPublicUsers'
import { Request } from 'express'
import { User } from '../database/EntityUser'

export const DecodedJWTSchema = yup.object().shape({
  email: yup.string().required(),
  id: yup.string().required(),
  // TODO: add union UserLoginType
  login_type: yup
    .string()
    .oneOf([AuthJWTUserLoginType.Custom, AuthJWTUserLoginType.Google])
    .required(),
})

export type DecodedJWTSchemaType = yup.InferType<typeof DecodedJWTSchema>

export type AuthRequest = Request & {
  user?: User
  publicUser?: PublicUser
}
