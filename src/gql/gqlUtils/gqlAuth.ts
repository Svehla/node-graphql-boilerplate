import { GqlContext } from '../../utils/GqlContextType'
import { UserHaveToBeLoggedError } from '../gqlSharedErrors/auth'
import { notNullable } from '../../utils/typeGuards'

type AuthConfig = {
  onlyLogged?: boolean
  onlyLoggedUser?: boolean
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

// TODO: add properly typed context
// mutation resolver hav the same API as the query resolvers
export const authGqlMutationDecorator = authGqlQueryDecorator

const checkUserAccessOrError = (config: AuthConfig, gqlContext: GqlContext) => {
  const user = gqlContext.req.user

  if (config.onlyLoggedUser) {
    if (!notNullable(user)) {
      throw new UserHaveToBeLoggedError()
    }
  }
  if (config.onlyLogged) {
    if (!notNullable(user)) {
      throw new UserHaveToBeLoggedError()
    }
  }

  return true
}
