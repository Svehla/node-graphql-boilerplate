import * as Sequelize from 'sequelize'
import { UserRole } from '../../constants'

export interface IUserAttributes {
  id?: number
  email: string
  name: string
  role: UserRole
  password: string
  created_at?: number
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
    role: {
      type: Sequelize.ENUM,
      values: Object.keys(UserRole)
    },
    password: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  })
  return User
}
