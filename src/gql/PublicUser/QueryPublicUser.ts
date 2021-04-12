import { GqlPublicUser } from './GqlPublicUser'
import { authGqlQueryDecorator } from '../gqlUtils/gqlAuth'
import { tgGraphQLBoolean, tgGraphqlSubQueryType } from '../../libs/typedGraphQL/index'

export const publicUserQueryFields = () =>
  tgGraphqlSubQueryType(
    {
      publicUserViewer: {
        type: GqlPublicUser,
      },
      isPublicUserLoggedIn: {
        type: tgGraphQLBoolean,
      },
    },
    {
      publicUserViewer: authGqlQueryDecorator({ onlyLogged: true })(async (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return publicUser
      }),
      isPublicUserLoggedIn: (_args, ctx) => {
        const publicUser = ctx.req.publicUser
        return Boolean(publicUser)
      },
    }
  )
