import { GqlCategory } from './GqlCategory'
import {
  cursorPaginationArgs,
  cursorPaginationList,
  getSelectAllDataWithCursorByCreatedAt,
} from '../gqlUtils/gqlCursorPagination'
import { entities } from '../../database/entities'
import { graphqlSubQueryType } from '../../libs/typedGraphQL/index'

export const categoryQueryFields = () =>
  graphqlSubQueryType(
    {
      allUniqCategories: {
        args: cursorPaginationArgs(),
        type: cursorPaginationList('allUniqCategories', GqlCategory),
      },
    },
    {
      allUniqCategories: async args => {
        return getSelectAllDataWithCursorByCreatedAt(entities.Category, args)
      },
    }
  )
