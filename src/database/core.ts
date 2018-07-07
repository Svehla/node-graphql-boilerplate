import * as Sequelize from 'sequelize'
import { IPostAttributes, PostInstance } from './models/PostModel'
import { IUserAttributes, UserInstance } from './models/UserModel'

const sequelize = new Sequelize(
  process.env.ENVIROMENT === 'test'
    ? process.env.TEST_DB_DATABASE_NAME
    : process.env.DB_DATABASE_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT, 10),
    logging: false, // console.log,
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      freezeTableName: true,
      timestamps: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  },
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })


// config models
const models = {
  Post: sequelize.import<PostInstance, IPostAttributes>('./models/PostModel'),
  User: sequelize.import<UserInstance, IUserAttributes>('./models/UserModel'),
  sequelize,
}

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models)
  }
})

models.User.hasMany(models.Post, {
  foreignKey: 'user_id',
  sourceKey: 'id',
  constraints: false,
})


export default models
