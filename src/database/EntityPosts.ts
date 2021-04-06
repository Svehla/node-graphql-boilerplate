import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './EntityUser'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  author: User

  @Column({ nullable: true })
  authorId: number

  @Column({ nullable: true })
  text: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
