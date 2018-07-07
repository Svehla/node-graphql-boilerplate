import UserType from './UserType'
import { isNilOrEmpty } from 'ramda-adjunct'

export default {
  viewer: {
    type: UserType,
    description: 'current logged user -> viewer',
    resolve: (parentValues, args, { req: { user } }) => {
      if (isNilOrEmpty(user)) {
        return null
      } else {
        return user
      }
    },
  },
}
