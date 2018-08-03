import { createError } from 'apollo-errors'

export const POST_NOT_FOUND = createError('POST_NOT_FOUND', {
  message: 'Post wasnt found'
})