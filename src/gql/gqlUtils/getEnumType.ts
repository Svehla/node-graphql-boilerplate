import { GraphQLEnumType } from 'graphql'

type StringTuple = [string, string | number | boolean]
export default (
  typeName: string,
  possibleValues: string[] | StringTuple[]
) => (
   new GraphQLEnumType({
    name: typeName,
    // @ts-ignore
    values: possibleValues.reduce((pre, enumConf: string | StringTuple) => {
      let name = null
      let value = null
      if (Array.isArray(enumConf)) {
        name = enumConf[0]
        value = enumConf[1]
      } else {
        name = enumConf
        value = enumConf
      }
      pre[name] = {
        value
      }
      return pre
    }, {})
  })
)
