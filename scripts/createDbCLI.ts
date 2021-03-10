// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import createDb from './createDb'

const main = async () => {
  await createDb()
  process.exit()
}

main()
