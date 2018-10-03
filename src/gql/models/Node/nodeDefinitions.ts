import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import { checkPermissions } from '../../../auth/checkPermissions'
import models from '../../../database/core'
import { InvalidNodeIdError, nodeNotFoundError, UnknownNodeTypeError } from './nodeErrors'

import { typeName as commentTypeName } from '../Comment/CommentType'
import { typeName as postTypeName } from '../Post/PostType'
import { typeName as userTypeName } from '../User/UserType'

const nDefinitions = nodeDefinitions(async (globalId, { req: { user }}) => {
  const { type, id: unparsedId } = fromGlobalId(globalId)
  const id = Number(unparsedId)
  if (isNilOrEmpty(type) || isNilOrEmpty(id) || isNaN(id)) {
    throw new InvalidNodeIdError()
  }

  let foundNode = null
  switch (type) {
    case postTypeName: {
      foundNode = await models.Post.findById(id)
      break
    }
    case commentTypeName: {
      foundNode = await models.Comment.findById(id)
      break
    }
    case userTypeName: {
      checkPermissions({ onlyLogged: true }, user)
      foundNode = await models.User.findById(id)
      break
    }
    default:
      throw new UnknownNodeTypeError()
  }
  // this add meta data about returned value from db
  // => gql isTypeOf can resolve gql type (not 100% based) on dbTable (f.e: School / PublicSchool)
  foundNode.__typeOfGqlNode = type

  if (isNilOrEmpty(foundNode)) {
    throw new nodeNotFoundError()
  }
  return foundNode
})

export const nodeField = nDefinitions.nodeField
export const nodeInterface = nDefinitions.nodeInterface
