

import { IPostAttributes } from '../src/database/models/PostModel'

const userMockData: IPostAttributes[] = [
  {
    // id: 1,
    user_id: 1,
    text: 'Hallo, this is my first status',
    created_at: 1411970619716,
  },
  {
    // id: 2,
    user_id: 2,
    text: 'Hallo, this is my first status',
    created_at: 1621970619716,
  },
  {
    // id: 3,
    user_id: 1,
    text: '12 Hallo, this is my second status',
    created_at: 1531970619716,
  },
  {
    // id: 4,
    user_id: 2,
    text: '22 Wow this is MY SECOND POST',
    created_at: 1541970619716,
  },
]

export default userMockData
