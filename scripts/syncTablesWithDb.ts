
import models from '../src/database/core'

const syncTablesWithDb = async () => {
  console.log(`syncTablesWithDb is not working at the moment`)
  // TODO: fix enum migrations
  // console.time('sync-tables-with-db')
  // await models.sequelize.sync({ alter: true })
  // console.timeEnd('sync-tables-with-db')
  process.exit()
}

syncTablesWithDb()
