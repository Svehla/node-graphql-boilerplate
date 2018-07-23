import { Client } from 'pg'

const createDb = async () => {
  // create the connection to database
  console.time('create/renew-database')

  const databaseName = process.env.ENVIROMENT === 'test'
    ? process.env.TEST_DB_DATABASE_NAME
    : process.env.DB_DATABASE_NAME

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })

  await client.query(
    `DROP DATABASE IF EXISTS ${databaseName};`,
  )
  await client.query(
    `CREATE DATABASE IF NOT EXISTS ${databaseName};`,
  )
  console.timeEnd('create/renew-database')
  process.exit()
}

createDb()
