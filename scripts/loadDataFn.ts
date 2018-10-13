import * as fixtures from '../fixtures'
import models from '../src/database/core'

/**
 * loadDataToDb load pure fixtures json data to pg tables
 */
export const loadDataToDb = async () => {
  if (process.env.ENVIROMENT !== 'test') {
    console.log(`process.env.ENVIROMENT: ${process.env.ENVIROMENT}`)
  }
  if (process.env.ENVIROMENT === 'prod') {
    throw new Error ('cant change prod database')
  }
  // synchronous loading rows to db
  // => it have to be sync coz of auto_increment ids ORDER
  for (const userData of fixtures.usersMockData) {
    await models.User
      .build(userData)
      .save()
  }
  for (const postData of fixtures.postsMockData) {
    await models.Post
      .build(postData)
      .save()
  }
  for (const commentData of fixtures.commentsMockData) {
    await models.Comment
      .build(commentData)
      .save()
  }
}

const loadData = async () => {
  if (process.env.ENVIROMENT === 'prod') {
    throw new Error ('cant change prod database')
  }
  try {
    // force: true truncate all tables
    await models.sequelize.sync({ force: true })
    await loadDataToDb()
  } catch (e) {
    console.error(`Can't load data & reset database`)
    console.error(e)
  }
}


export default loadData
