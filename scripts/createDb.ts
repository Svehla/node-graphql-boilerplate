import * as mysql from 'mysql2/promise'

const createDb = async () => {
  // create the connection to database
  console.time('create/renew-database')
  const databaseName = process.env.ENVIROMENT === 'test'
    ? process.env.TEST_DB_DATABASE_NAME
    : process.env.DB_DATABASE_NAME

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  await connection.execute(
    `DROP DATABASE IF EXISTS ${databaseName};`,
  )
  await connection.execute(
    `CREATE DATABASE IF NOT EXISTS ${databaseName};`,
  )
  console.timeEnd('create/renew-database')
  process.exit()
}

createDb()
