import * as Sequelize from 'sequelize'

export interface ICommentAttributes {
  id?: number
  author_user_id: number
  post_id: number
  text: string
}

export type CommentInstance = Sequelize.Instance<ICommentAttributes> & ICommentAttributes

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const CommentModel = sequelize.define<CommentInstance, ICommentAttributes>('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author_user_id: {
      type: DataTypes.INTEGER,
    },
    post_id: {
      type: DataTypes.INTEGER,
    },
    text: {
      type: DataTypes.STRING,
    },
  })

  CommentModel.associate = (models) => {
    models.User.hasMany(models.Post, {
      foreignKey: 'user_id',
      sourceKey: 'id',
      constraints: false,
    })
    models.User.belongsTo(models.Comment, { foreignKey: 'user_id' })
  }

  return CommentModel
}
