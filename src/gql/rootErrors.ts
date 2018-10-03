import { createError } from 'apollo-errors'

export const InvalidCredentialsError = createError('InvalidCredentialsError', {
  message: 'Invalid credentials'
})

export const NotLoggedError = createError('NotLoggedError', {
  message: 'Not logged'
})
