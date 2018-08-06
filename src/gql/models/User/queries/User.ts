import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql'
import { fromGlobalId } from 'graphql-relay'
import { isNilOrEmpty } from 'ramda-adjunct'
import UserType from '../UserType'
import models from '../../../../database/core'

const User = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'User id'
    },
  },
  description: 'Find one user',
  resolve: (parent, { id }) => {
    const { id: convertedId } = fromGlobalId(id)
    const user = models.User.findOne({
      where: {
        id: convertedId
      }
    })
    return isNilOrEmpty(user) ? null : user
  }
}

export default User
