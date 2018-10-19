

import { IPostAttributes } from '../src/database/models/PostModel'
import * as moment from 'moment'
const userMockData: IPostAttributes[] = [
  {
    // id: 1,
    author_user_id: 1,
    text: 'Hallo, this is my first status',
    created_at: moment('1.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    // id: 2,
    author_user_id: 2,
    text: 'Hallo, this is my first status',
    created_at: moment('2.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    // id: 3, ...
    author_user_id: 1,
    text: '12 Hallo, this is my second status',
    created_at: moment('3.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    author_user_id: 2,
    text: '22 Wow this is MY SECOND POST',
    created_at: moment('4.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    author_user_id: 2,
    text: '22 Wow this is MY SECOND POST',
    created_at: moment('5.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    author_user_id: 2,
    text: '22 Wow this is MY SECOND POST',
    created_at: moment('6.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    author_user_id: 2,
    text: '22 Wow this is MY SECOND POST',
    created_at: moment('7.1.2016', 'DD.MM.YYYY').valueOf(),
  },
  {
    author_user_id: 2,
    text: '22 Wow this is MY SECOND POST',
    created_at: moment('8.1.2016', 'DD.MM.YYYY').valueOf(),
  },
]

export default userMockData
