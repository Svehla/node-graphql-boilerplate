import { createError } from 'apollo-errors'

export const INVALID_CREDENTIALS = createError('INVALID_CREDENTIALS', {
  message: 'Invalid credentials'
})

export const NOT_LOGGED = createError('NOT_LOGGED', {
  message: 'Not logged'
})
