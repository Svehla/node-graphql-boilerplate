import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import models from '../../../database/core'

const nDefinitions = nodeDefinitions(async (globalId) => {
  const { type, id: unparsedId } = fromGlobalId(globalId)
  const id = parseInt(unparsedId, 10)
  if (isNilOrEmpty(type) || isNilOrEmpty(id)) {
    throw new Error('Invalid node ID.')
  }
  let finededNode = null
  switch (type) {
    case 'Post':
      finededNode = await models.Post.findById(id)
      break
    case 'User':
      finededNode = await models.User.findById(id)
      break
    default:
      throw new Error('Unknown node type to this ID')
  }

  if (isNilOrEmpty(finededNode)) {
    throw new Error('Node not found.')
  }
  return finededNode
})

export const nodeField = nDefinitions.nodeField
export const nodeInterface = nDefinitions.nodeInterface
