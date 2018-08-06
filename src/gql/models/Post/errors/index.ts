import { createError } from 'apollo-errors'

export const POST_NOT_FOUND = createError('POST_NOT_FOUND', {
  message: 'Post wasnt found'
})

export const POST_NOT_CREATED = createError('POST_NOT_CREATED', {
  message: 'Post wasnt created'
})