
import { createError } from 'apollo-errors'

export const InvalidNodeIdError = createError('InvalidNodeIdError', {
  message: 'Invalid node error'
})

export const UnknownNodeTypeError = createError('UnknownNodeTypeError', {
  message: 'Unknown node type error'
})

export const nodeNotFoundError = createError('nodeNotFoundError', {
  message: 'node not found error'
})

