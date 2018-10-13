import loadInitDataToDb from '../scripts/loadDataFn'
import * as server from '../src/server'

let app
// about mocha timeouts
// https://stackoverflow.com/questions/49922406/mocha-beforeeach-exceeds-timeout

before(async function() {
  this.timeout(10000)
  await loadInitDataToDb()
  app = await server.startServer()
  return true
})

after(async function() {
  this.timeout(10000)
  await server.stopServer(app)
  return true
})

beforeEach(async function() {
  this.timeout(10000)
  await loadInitDataToDb()
})
