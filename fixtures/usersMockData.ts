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
]

const salt = bcrypt.genSaltSync(10)
const passwordHash = bcrypt.hashSync('password1', salt)

export const usersMockData = [
  ...Array(0)
    // ...Array(fakeImages.length)
    .fill(0)
    .map((_, index) => ({
      email: `user-${index}@example.com`,
      age: index,
      role: UserRole.Admin,
      password: passwordHash,
      profileImgUrl: fakeImages[index],
    })),
]
