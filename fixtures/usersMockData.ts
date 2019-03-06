import * as seed from 'math-random-seed'
import { IUserAttributes, UserRole } from '../src/database/models/UserModel'
import * as moment from 'moment'
import * as TwinBcrypt from 'twin-bcrypt'

const names = [
  'Oliver',
  'Jake',
  'Noah',
  'James',
  'Jack',
  'Connor',
  'Liam',
  'John',
  'Harry',
  'Callum',
  'Mason',
  'Robert',
  'Jacob',
  'Michael',
  'Joe',
  'Ethan',
  'David',
  'George',
  'Reece',
  'Richard',
  'Oscar',
  'Rhys',
  'Alexander',
  'Joseph',
  'Charlie',
  'Charles',
  'William',
  'Damian',
  'Daniel',
  'Thomas'
]
const fakeImages = [
  'https://randomuser.me/api/portraits/men/13.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/men/87.jpg',
  'https://randomuser.me/api/portraits/men/68.jpg',
  'https://randomuser.me/api/portraits/men/91.jpg',
  'https://randomuser.me/api/portraits/women/43.jpg',
  'https://randomuser.me/api/portraits/women/33.jpg',
  'https://randomuser.me/api/portraits/women/27.jpg',
  'https://randomuser.me/api/portraits/women/89.jpg',
  'https://randomuser.me/api/portraits/women/15.jpg',
  'https://randomuser.me/api/portraits/women/51.jpg',
  'https://randomuser.me/api/portraits/women/25.jpg',
  'https://randomuser.me/api/portraits/women/42.jpg',
  'https://randomuser.me/api/portraits/women/61.jpg',
  'https://randomuser.me/api/portraits/women/31.jpg',
  'https://randomuser.me/api/portraits/women/81.jpg',
  'https://randomuser.me/api/portraits/women/7.jpg',
  'https://randomuser.me/api/portraits/women/0.jpg',
  'https://randomuser.me/api/portraits/women/84.jpg',
  'https://randomuser.me/api/portraits/women/5.jpg',
  'https://randomuser.me/api/portraits/women/23.jpg',
  'https://randomuser.me/api/portraits/women/11.jpg',
  'https://randomuser.me/api/portraits/women/2.jpg',
  'https://randomuser.me/api/portraits/women/78.jpg',
  'https://randomuser.me/api/portraits/women/35.jpg',
  'https://randomuser.me/api/portraits/women/77.jpg',
  'https://randomuser.me/api/portraits/women/67.jpg',
  'https://randomuser.me/api/portraits/women/56.jpg',
  'https://randomuser.me/api/portraits/women/63.jpg',
  'https://randomuser.me/api/portraits/women/18.jpg',
  'https://randomuser.me/api/portraits/women/19.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/women/74.jpg',
  'https://randomuser.me/api/portraits/women/41.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
]

const getIntSeedRanInRange = (seedNum: number, max: number): number =>
  Math.floor(seed(seedNum.toString())() * max)

const getRandomName = (index: number) =>
  names[getIntSeedRanInRange(index - 1, names.length - 1)] + ' ' +
  names[getIntSeedRanInRange(index, names.length)]

const userMockData: IUserAttributes[] = [
  ...Array(fakeImages.length).fill(0).map((_, index) => ({
    email: 'some@email.com',
    name: getRandomName(index),
    role: UserRole.Admin,
    // pwd 1111 hash
    password: TwinBcrypt.hashSync('top-kek'),
    created_at: moment('1.1.2015', 'DD.MM.YYYY').add('days', index).valueOf(),
    profile_img_url: fakeImages[index]
  }))
]

export default userMockData
