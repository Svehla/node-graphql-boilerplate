
// tslint:disable-next-line
const dotEnv = require('dotenv')
if (process.env.ENVIROMENT !== 'production') {
  dotEnv.load()
}
// tslint:disable-next-line
const server = require('./server')
server.startServer()
