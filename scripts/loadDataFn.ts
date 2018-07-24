import models from '../src/database/core'
import { usersMockData, postsMockData, commentsMockData } from '../fixtures'

export const loadDataToDb = async () => {
  await Promise.all<any>([
    ...usersMockData.map(userData => (
      models.User
        .build(userData)
        .save()
    )),
    ...postsMockData.map(postData => {
      models.Post
        .build(postData)
        .save()
      }),
    ...commentsMockData.map(commentData => {
      models.Comment
        .build(commentData)
        .save()
      }),
  ])
}

const loadData = async () => {
  // tforce: true truncate all tables
  await models.sequelize.sync({ force: true })
  await loadDataToDb()
}


export default loadData
