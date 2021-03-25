import { GqlUser } from './GqlUser'
import { authGqlQueryDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import { graphqlSubQueryType } from '../../libs/typedGraphQL/typedGqlTypes'
import { offsetPaginationArgs, offsetPaginationList } from '../gqlUtils/gqlOffsetPagination'

export const userQueryFields = () =>
  graphqlSubQueryType(
    {
      users: {
        args: offsetPaginationArgs('query_users'),
        type: offsetPaginationList('query_users', GqlUser),
      },
    },
    {
      users: authGqlQueryDecorator({ onlyLogged: true })(async args => {
        const repository = getRepository(entities.User)

        const [users, count] = await repository.findAndCount({
          skip: args.pagination.offset,
          take: args.pagination.limit,
        })

        return {
          count,
          items: users,
        }
      }),
    }
  )
