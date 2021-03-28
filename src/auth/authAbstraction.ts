import * as yup from 'yup'
import { AuthJWTUserLoginType, User } from '../database/EntityUser'
import { Request } from 'express'

export const DecodedJWTSchema = yup.object().shape({
  email: yup.string().required(),
  id: yup.string().required(),
  // TODO: add union UserLoginType
  loginType: yup
    .string()
    .oneOf([AuthJWTUserLoginType.Custom, AuthJWTUserLoginType.Google])
    .required(),
})

export type DecodedJWTSchemaType = yup.InferType<typeof DecodedJWTSchema>

export type AuthRequest = Request & {
  user?: User
}
