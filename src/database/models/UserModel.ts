import * as Sequelize from 'sequelize'

export enum UserRole {
  Admin = 'Admin',
  Pleb = 'Pleb',
}

export interface IUserAttributes {
  id?: number
  email: string
  name: string
  role: UserRole
  password: string
  created_at: number
  profile_img_url?: string
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
    },
    profile_img_url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  })


  User.associate = (models) => {
    models.User.hasMany(models.Post, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      constraints: false,
    })
    models.User.hasMany(models.Comment, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      constraints: false,
    })
  }

  return User
}
