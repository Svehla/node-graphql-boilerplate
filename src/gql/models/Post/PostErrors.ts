import { createError } from 'apollo-errors'

export const PostNotFoundError = createError('PostNotFoundError', {
  message: 'Post wasnt found'
})

export const PostNotCreatedError = createError('PostNotCreatedError', {
  message: 'Post wasnt created'
})
