
import {
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLList,
  GraphQLInputObjectType,
} from 'graphql'

enum OrderByKeyword {
  ASC = 'ASC',
  DESC = 'DESC',
}
const GraphQLAscDesc = new GraphQLEnumType({
  name: 'OrderByKeyword',
  values: {
    [OrderByKeyword.ASC]: {
      value: OrderByKeyword.ASC,
    },
    [OrderByKeyword.DESC]: {
      value: OrderByKeyword.DESC,
    },
  },
})


export default (typeName, possibleOrderByKeys) => {
  const GraphQlOrderByEnum = new GraphQLEnumType({
    name: `${typeName}PossibleKeys`,
    values: possibleOrderByKeys.reduce((pre, name) => {
      pre[name] = {
        value: name,
      }
      return pre
    }, {})
  })

  const GraphQLOrderByType = new GraphQLInputObjectType({
    name: typeName,
    description: ``,
    fields: () => ({
      order: {
        type: new GraphQLNonNull(GraphQLAscDesc),
        description: ``,
      },
      key: {
        type: new GraphQLNonNull(GraphQlOrderByEnum),
        description: ``,
      },
    })
  })

  return new GraphQLList(GraphQLOrderByType)
}
