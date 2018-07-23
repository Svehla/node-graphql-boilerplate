
import { UserRole } from '../../../../constants'
import getEnumType from '../../../types/getEnumType'

export default getEnumType('GraphQLUserRole', Object.keys(UserRole))
