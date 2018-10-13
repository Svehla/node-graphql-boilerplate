
import { isNilOrEmpty } from 'ramda-adjunct'
import { IUserAttributes, UserRole } from '../database/models/UserModel'
import { UserHasNoPermissions, UserHaveToBeLoggedError } from '../gql/gqlSharedErrors/auth'

interface IAuthConfig {
  onlyLogged?: boolean
  allowRoles?: UserRole[]
  deniedRoles?: UserRole[]
}

// throw error when user is not authorized
export const checkPermissions = (config: IAuthConfig, user: IUserAttributes | null): void => {
  if (config.onlyLogged) {
    if (isNilOrEmpty(user)) {
      throw new UserHaveToBeLoggedError()
    }
  }
  if (Array.isArray(config.allowRoles)) {
    // @ts-ignore
    if (!config.allowRoles.includes(user.role)) {
      throw new UserHasNoPermissions()
    }
  }
  if (Array.isArray(config.deniedRoles)) {
    // @ts-ignore
    if (config.deniedRoles.includes(user.role)) {
      throw new UserHasNoPermissions()
    }
  }
}


const gqlAuthResolvers = (
  isMutation: boolean
) => (config: IAuthConfig = {}) => (resolver) => (...resolverArgs) => {
  // in relay mutation mutationWithClientMutationId is context the second parameter
  // but in gql query resolver its third parameter O_O that's the magic
  const contextArgsIndex = isMutation ? 1 : 2
  const context = resolverArgs[contextArgsIndex]
  const user: IUserAttributes | null = context.req.user
  checkPermissions(config, user)
  return resolver(...resolverArgs)
}


export const gqlAuthMutation = gqlAuthResolvers(true)

export const gqlAuthQuery = gqlAuthResolvers(false)

