import { createError } from 'apollo-errors'

export const UserNotFoundError = createError('UserNotFoundError', {
  message: 'User was not found'
})

export const UserNotCreatedError = createError('UserNotCreatedError', {
  message: 'User wasnt created'
})
