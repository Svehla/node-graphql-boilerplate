
import { IUserAttributes } from '../src/database/models/UserModel'
import { UserRole } from '../src/constants'

const userMockData: IUserAttributes[] = [
  {
    // id: 1,
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: UserRole.Admin,
    // pwd 1111 hash
    password: '$2y$10$Bqp4wY5CVVUCmQQpBX8WQO/NjUSrgQVTg6ZbsaTILdONEZv290Mk2',
    created_at: 1542970619716,
  },
  {
    // id: 2,
    email: 'john.smith@example.com',
    name: 'John Smith',
    role: UserRole.Contributor,
    // pwd 2222 hash
    password: '$2y$10$086dxg98L.gFlmEy.oyCfudmFFwX3..nXH/hL2RMVKsqtncvg2Xqi',
    created_at: 1541370619716,
  },
]

export default userMockData
