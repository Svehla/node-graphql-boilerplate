// tslint:disable-next-line
require('dotenv').load()
import { Client } from 'pg'

const createDb = async () => {
  if (process.env.ENVIROMENT !== 'test') {
    console.log(`process.env.ENVIROMENT: ${process.env.ENVIROMENT}`)
  }
  if (process.env.ENVIROMENT === 'prod') {
    throw new Error (`Can't change prod database`)
  }
  // create the connection to database
  try {
    console.time('create/renew-database')

    const databaseName = process.env.ENVIROMENT === 'test'
      ? process.env.TEST_DB_DATABASE_NAME
      : process.env.DB_DATABASE_NAME

    const clientToPostgresDb = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres'
    })
    clientToPostgresDb.connect()
    try {
      await clientToPostgresDb.query(
        `DROP DATABASE IF EXISTS ${databaseName};`,
      )
      await clientToPostgresDb.query(
        `CREATE DATABASE ${databaseName};`,
      )
    } catch (e) {
      console.log('CREATE DB err -> this is probably not error... just db is already created')
    }

    const clientToDb = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: databaseName
    })

    clientToDb.connect()
    await clientToDb.query(
      `CREATE EXTENSION IF NOT EXISTS unaccent;`,
    )

    console.timeEnd('create/renew-database')
  } catch (e) {
    console.error(e)
  }
}

export default createDb
