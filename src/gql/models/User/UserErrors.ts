import { createError } from 'apollo-errors'

export const InvalidLoginCredentialsError = createError('InvalidLoginCredentialsError', {
  message: 'Invalid login credentials'
})
