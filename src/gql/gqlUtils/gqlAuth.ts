import { UserHasNoPermissions, UserHaveToBeLoggedError } from '../gqlSharedErrors/auth'
import { UserRole } from '../../database/EntityUser'
import { notNullable } from '../../utils/typeGuards'

type AuthConfig = {
  onlyLogged?: boolean
  allowUserRoles?: UserRole[]
  deniedRoles?: UserRole[]
}
export const authGqlTypeDecorator = (config: AuthConfig) => <Parent, Args, T>(
  fn: (p: Parent, args: Args, context: any) => T
) => (p: Parent, args: Args, context: any): T => {
  checkUserAccessOrError(config, context)
  return fn(p, args, context)
}

export const authGqlQueryDecorator = (config: AuthConfig) => <Args, T>(
  fn: (args: Args, context: any) => T
) => (args: Args, context: any): T => {
  checkUserAccessOrError(config, context)
  return fn(args, context)
}

// mutation resolver hav the same API as the query resolvers
export const authGqlMutationDecorator = authGqlQueryDecorator

const checkUserAccessOrError = (config: AuthConfig, gqlContext: any) => {
  const user = gqlContext.req.user
  const publicUser = gqlContext.req.publicUser

  if (config.onlyLogged) {
    if (!notNullable(user) && !notNullable(publicUser)) {
      throw new UserHaveToBeLoggedError()
    }
  }
  if (Array.isArray(config.allowUserRoles)) {
    // @ts-ignore
    if (!config.allowUserRoles.includes(user.role)) {
      throw new UserHasNoPermissions()
    }
  }
  if (Array.isArray(config.deniedRoles)) {
    // @ts-ignore
    if (config.deniedRoles.includes(user.role)) {
      throw new UserHasNoPermissions()
    }
  }

  return true
}
