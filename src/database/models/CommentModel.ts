import * as Sequelize from 'sequelize'

export interface ICommentAttributes {
  id?: number
  user_id: number
  post_id: number
  text: string
}

export type CommentInstance = Sequelize.Instance<ICommentAttributes> & ICommentAttributes

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  return sequelize.define<CommentInstance, ICommentAttributes>('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    post_id: {
      type: DataTypes.INTEGER,
    },
    text: {
      type: DataTypes.STRING,
    },
  })
}
