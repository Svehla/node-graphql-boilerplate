
import models from '../src/database/core'

const addTablesToDB = async () => {
  console.time('add-tables-to-db')
  await models.sequelize.sync({ force: true })
  console.timeEnd('add-tables-to-db')
  process.exit()
}

addTablesToDB()
