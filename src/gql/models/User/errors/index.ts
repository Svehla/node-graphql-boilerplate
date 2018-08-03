import { createError } from 'apollo-errors'

export const USER_NOT_FOUND = createError('USER_NOT_FOUND', {
  message: 'User was not found'
})

export const USER_NOT_CREATED = createError('USER_NOT_CREATED', {
  message: 'User wasnt created'
})