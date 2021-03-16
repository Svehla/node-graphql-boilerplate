import { createError } from 'apollo-errors'

export const ErrorWhileLogin = createError('ErrorWhileLogin', {
  message: `Error while login`,
})
