import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const GraphQLEmailType = new GraphQLScalarType({
  name: 'Email',
  serialize: value => value.toLowerCase(),
  parseValue: value => value.toLowerCase(),
  parseLiteral: (valueAST) => {
    // TODO: add validations
    if (valueAST.kind !== Kind.STRING) {
      return null
      /*
      throw new GraphQLError(
        `Query error: Email is not a string, it is a: ${valueAST.kind}`,
        [valueAST],
      )
      */
    }
    /*
    if (!validator.isEmail(valueAST.value)) {
      // return null
      throw new GraphQLError('Query error: Not a valid Email', [valueAST])
    }

    if (valueAST.value.length < 4) {
      // return null
      throw new GraphQLError(
        `Query error: Email must have a minimum length of 4.`,
        [valueAST],
      )
    }

    if (valueAST.value.length > 300) {
      // return null
      throw new GraphQLError(`Query error: Email is too long.`, [valueAST])
    }
    */
    // @ts-ignore
    return valueAST.value.toLowerCase()
  },
})

export default GraphQLEmailType
