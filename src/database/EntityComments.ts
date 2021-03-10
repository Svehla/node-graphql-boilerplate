import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  // TODO: add connection
  @Column({ nullable: true })
  authorId: number

  // TODO: add connection
  @Column({ nullable: true })
  postId: number

  @Column({ nullable: true })
  text: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
