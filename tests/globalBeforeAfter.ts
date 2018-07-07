import * as server from '../src/server'
import loadInitDataToDb from '../scripts/loadDataFn'

let app
before(async () => {
  await loadInitDataToDb()
  app = await server.startServer()
  return true
})

after(async () => {
  // remove database data here
  // await clearDb()
  await server.stopServer(app)
  return true
})

beforeEach(async () => {
  // await loadInitDataToDb()
})

