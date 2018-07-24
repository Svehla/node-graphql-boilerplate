import models from '../src/database/core'
import { usersMockData, postsMockData, commentsMockData } from '../fixtures'

export const loadDataToDb = async () => {
  // synchronous loading rows to db => it have to be sync coz of auto_increment ids
  for (const userData of usersMockData) {
    await models.User
      .build(userData)
      .save()
  }
  for (const postData of postsMockData) {
    await models.Post
      .build(postData)
      .save()
  }
  for (const commentData of commentsMockData) {
    await models.Comment
      .build(commentData)
      .save()
  }
}

const loadData = async () => {
  // force: true truncate all tables
  await models.sequelize.sync({ force: true })
  await loadDataToDb()
}


export default loadData
