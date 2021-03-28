import { GqlUser } from './GqlUser'
import { authGqlQueryDecorator } from '../gqlUtils/gqlAuth'
import { entities } from '../../database/entities'
import { getRepository } from 'typeorm'
import { graphqlSubQueryType, tgGraphQLNonNull } from '../../libs/typedGraphQL/index'
import { listPaginationArgs, wrapPaginationList } from '../gqlUtils/gqlPagination'

export const userQueryFields = () =>
  graphqlSubQueryType(
    {
      users: {
        args: {
          pagination: {
            type: listPaginationArgs('usersQuery'),
          },
        },
        type: wrapPaginationList('users', tgGraphQLNonNull(GqlUser)),
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
