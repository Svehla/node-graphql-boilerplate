import { createError } from 'apollo-errors'
import { GraphQLScalarType } from 'graphql'
import { fromGlobalId } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
export const InvalidReportIdError = createError('InvalidReportIdError', {
  message: 'Invalid report id'
})

export const getGlobalIdType = (typeName: string) => {

  const InvalidGlobalIdError = createError(`Invalid${typeName}GlobalIdError`, {
    message: `Invalid ${typeName} global id`
  })

  // https://github.com/graphql/graphql-js/issues/500#issuecomment-248992816
  const parseGlobalId = (val) => {
    const { type, id: textId } = fromGlobalId(val)
    const id = Number(textId)
    if (type !== typeName || isNilOrEmpty(id) || isNaN(id)) {
      throw new InvalidGlobalIdError()
    }
    return id
  }

  return new GraphQLScalarType({
    name: `${typeName}GlobalId`,
    description: `global id of ${typeName}`,
    serialize: (val) => {
      // graphql relay js extend node with ID
      // i cant find how to extend ID to custom scalar type for working node interface
      // so i cnat use this serialize to type of graphql id of current type
      // TODO: extend this scalar type with ID + uncomment serializing id
      // return toGlobalId(typeName, val.id)
      return val
    },
    parseValue: val => parseGlobalId(val),
    // @ts-ignore
    parseLiteral: ast => parseGlobalId(ast.value),
  })
}

