import { appEnvs } from '../appConfig'
import { createConnection } from 'typeorm'
import { entities } from './entities'

export const dbConnection = createConnection({
  type: 'postgres',
  host: appEnvs.postgres.HOST,
  port: appEnvs.postgres.PORT,
  username: appEnvs.postgres.USER,
  password: appEnvs.postgres.PASSWORD,
  database: appEnvs.postgres.DB_NAME,

  entities: Object.values(entities),

  // TODO: how to live with synchronize? TODO: add env?
  synchronize: appEnvs.postgres.TYPEORM_SYNCHRONIZE,
}).catch(error => {
  console.error(`can't connect to the database`)
  console.error(error)
})
