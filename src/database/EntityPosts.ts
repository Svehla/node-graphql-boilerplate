import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  // TODO: add connection
  @Column({ nullable: true })
  authorId: number

  @Column({ nullable: true })
  text: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
