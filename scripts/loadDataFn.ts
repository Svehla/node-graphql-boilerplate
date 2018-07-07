import models from '../src/database/core'
import { usersMockData, postsMockData } from '../fixtures'

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
  ])
}

const loadData = async () => {
  // tforce: true truncate all tables
  await models.sequelize.sync({ force: true })
  await loadDataToDb()
}


export default loadData
