// tslint:disable-next-line
require('dotenv').load()
import createDb from './createDbFn'

const main = async () => {
  await createDb()
  process.exit()
}

main()
