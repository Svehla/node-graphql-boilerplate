import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum PostReactionType {
  Reaction1 = 'Reaction1',
  Reaction2 = 'Reaction2',
  Reaction3 = 'Reaction3',
  Reaction4 = 'Reaction4',
}

@Entity('post_reactions')
export class PostReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  authorId: string

  @Column({})
  postId: string

  @Column({
    type: 'enum',
    enum: PostReactionType,
  })
  reactionType: PostReactionType

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
