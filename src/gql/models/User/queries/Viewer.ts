import { isNilOrEmpty } from 'ramda-adjunct'
import UserType from '../UserType'

const Viewer = {
  type: UserType,
  description: 'current logged user -> viewer',
  resolve: (parentValues, args, { req: { user } }) => {
    if (isNilOrEmpty(user)) {
      return null
    } else {
      return user
    }
  },
}

export default Viewer
