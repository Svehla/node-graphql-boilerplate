import { createError } from 'apollo-errors'

export const UserHaveToBeLoggedError = createError('UserHaveToBeLoggedError', {
  message: 'You have to be logged to fetch data',
})

export const UserHasNoPermissions = createError('UserHasNoPermissions', {
  message: 'User has no permissions to fetch this data',
})
