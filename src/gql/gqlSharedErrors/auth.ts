
import { createError } from 'apollo-errors'

export const UserHaveToBeLoggedError = createError('UserHaveToBeLoggedError', {
  message: 'You have to be logged for fetching data by nodeId'
})

export const UserHasNoPermissions = createError('UserHasNoPermissions', {
  message: 'User has no permissions to fetch this node(s)'
})
