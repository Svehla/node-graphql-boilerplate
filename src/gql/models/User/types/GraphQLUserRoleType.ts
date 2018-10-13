import { UserRole } from '../../../../database/models/UserModel'
import getEnumType from '../../../gqlUtils/getEnumType'

export default getEnumType('UserRole', Object.keys(UserRole))
