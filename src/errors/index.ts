import { createError } from 'apollo-errors'

export const INVALID_CREDENTIALS = createError('INVALID_CREDENTIALS', {
  message: 'User is not logged'
})
