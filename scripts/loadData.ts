import * as fixtures from '../fixtures'
import { Comment } from '../src/database/EntityComments'
import { Post } from '../src/database/EntityPosts'
import { User } from '../src/database/EntityUser'
import { appEnvs } from '../src/appConfig'
import { dbConnection } from '../src/database/dbCore'
import { getRepository } from 'typeorm'

/**
 * loadDataToDb load pure fixtures json data to pg tables
 */
export const loadDataToDb = async () => {
  if (appEnvs.ENVIRONMENT === 'production') {
    throw new Error('cant change prod database')
  }

  // synchronous loading rows to db
  // => it have to be sync coz of auto_increment ids ORDER
  const userRepository = getRepository(User)
  for (const userData of fixtures.usersMockData) {
    const user = new User()
    for (const key in userData) {
      // @ts-expect-error
      user[key] = userData[key]
    }

    // TODO: is sync import ok?
    await userRepository.save(user)
  }

  const postRepository = getRepository(Post)
  for (const postData of fixtures.postsMockData) {
    const post = new Post()
    for (const key in postData) {
      // @ts-expect-error
      post[key] = postData[key]
    }
    await postRepository.save(post)
  }

  const commentRepository = getRepository(Comment)
  for (const commentData of fixtures.commentsMockData) {
    const comment = new Comment()
    for (const key in commentData) {
      // @ts-expect-error
      comment[key] = commentData[key]
    }

    await commentRepository.save(comment)
  }
}

const loadData = async () => {
  if (appEnvs.ENVIRONMENT === 'production') {
    throw new Error('cant change prod database')
  }

  await dbConnection

  try {
    // force: true truncate all tables
    // type ORM automatically add db synchronize
    // await models.sequelize.sync({ force: true })
    // https://stackoverflow.com/a/63112753

    await loadDataToDb()
  } catch (e) {
    console.error(`Can't load data & reset database`)
    console.error(e)
  }
}

export default loadData
