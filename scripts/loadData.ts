// tslint:disable-next-line
require('dotenv').load()
import loadData from './loadDataFn'

const main = async () => {
  await loadData()
  process.exit()
}

main()
