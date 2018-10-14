import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import { checkPermissions } from '../../../auth/checkPermissions'
import models from '../../../database/core'
import { InvalidNodeIdError, nodeNotFoundError, UnknownNodeTypeError } from './nodeErrors'
import NodeGqlImplement from '../NodeGqlImplement'

const nDefinitions = nodeDefinitions(async (globalId, { req: { user }}) => {
  const { type, id: unparsedId } = fromGlobalId(globalId)
  const id = Number(unparsedId)
  if (isNilOrEmpty(type) || isNilOrEmpty(id) || isNaN(id)) {
    throw new InvalidNodeIdError()
  }

  let foundNode = null
  switch (type) {
    case NodeGqlImplement.Post: {
      foundNode = await models.Post.findById(id)
      break
    }
    case NodeGqlImplement.Comment: {
      foundNode = await models.Comment.findById(id)
      break
    }
    case NodeGqlImplement.User: {
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
