import { GraphQLEnumType } from 'graphql'

export default (
  typeName: string,
  possibleValues: string[]
) => (
  new GraphQLEnumType({
    name: typeName,
    values: possibleValues.reduce((pre, name) => {
      pre[name] = {
        value: name,
      }
      return pre
    }, {})
  })
)
