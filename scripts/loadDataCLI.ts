// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import loadData from './loadData'

const main = async () => {
  await loadData()
  process.exit()
}

main()
