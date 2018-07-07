import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const GraphQLPasswordType = new GraphQLScalarType({
  name: 'Password',
  serialize: value => String(value),
  parseValue: value => String(value),
  parseLiteral: valueAST => {
    if (valueAST.kind !== Kind.STRING) {
      return null
      /*
      throw new Error(
        `Query error: Password is not a string, it is a: ${valueAST.kind}`,
        // [valueAST],
      )
      */
    }

      /*
    if (valueAST.value.length < 6) {
      throw new Error(
        `Query error: Password must have a minimum length of 6.`,
        // [valueAST],
      )
    }
    */
    return String(valueAST.value)
  },
})

export default GraphQLPasswordType
