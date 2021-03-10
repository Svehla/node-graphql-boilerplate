import { UserRole } from '../src/database/EntityUser'
import bcrypt from 'bcryptjs'

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

const salt = bcrypt.genSaltSync(10)
const passwordHash = bcrypt.hashSync('password1', salt)

export const usersMockData = [
  ...Array(fakeImages.length)
    .fill(0)
    .map((_, index) => ({
      email: `user-${index}@example.com`,
      age: index,
      role: UserRole.Admin,
      password: passwordHash,
      profileImgUrl: fakeImages[index],
    })),
]
