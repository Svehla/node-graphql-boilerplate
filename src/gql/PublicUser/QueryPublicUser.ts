import { GqlPublicUser } from './GqlPublicUser'
import { authGqlQueryDecorator } from '../gqlUtils/gqlAuth'
import { graphqlSubQueryType, gtGraphQLBoolean } from '../../libs/gqlLib/typedGqlTypes'

export const publicUserQueryFields = () =>
  graphqlSubQueryType(
    {
      publicUserViewer: {
        type: GqlPublicUser,
      },
      isPublicUserLoggedIn: {
        type: gtGraphQLBoolean,
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
