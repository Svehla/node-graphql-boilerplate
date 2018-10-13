import { isNilOrEmpty } from 'ramda-adjunct'
import UserType from './UserType'

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
