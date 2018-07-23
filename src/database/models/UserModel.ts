import * as Sequelize from 'sequelize'

export interface IUserAttributes {
  id: number
  name: string
  email: string
  password: string
}

export type UserInstance = Sequelize.Instance<IUserAttributes> & IUserAttributes

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const User = sequelize.define<UserInstance, IUserAttributes>('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
  })
  return User
}
