import {
  Column,
  CreateDateColumn,
  Entity,
  // JoinColumn,
  // OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
// import { User } from './EntityUser'

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number

  // public user id
  @Column()
  receiverId: number

  @Column({ default: false })
  read: boolean

  @Column({ default: '' })
  message: string

  @Column({ default: '' })
  urlPath: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
