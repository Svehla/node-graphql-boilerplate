import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('followers')
export class Followers {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  followerId: string

  @Column()
  followingId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
