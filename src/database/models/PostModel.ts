import * as Sequelize from 'sequelize'

export interface IPostAttributes {
  id?: number
  author_user_id?: number
  text?: string
  created_at?: number
  updated_at?: number
}

export type PostInstance = Sequelize.Instance<IPostAttributes> & IPostAttributes

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const Post = sequelize.define<PostInstance, IPostAttributes>('posts', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author_user_id: {
      type: DataTypes.INTEGER,
    },
    text: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
  })

  Post.associate = (models) => {
    models.Post.hasMany(models.Comment, {
      foreignKey: 'post_id',
      sourceKey: 'id',
      constraints: false,
    })
    models.Post.belongsTo(models.User, { foreignKey: 'user_id' })
  }
  return Post
}
