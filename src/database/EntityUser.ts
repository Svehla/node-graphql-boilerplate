import {
  Column,
  CreateDateColumn,
  Entity,
  // OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
// import { Post } from './EntityPosts'

export enum UserRole {
  Admin = 'Admin',
  Editor = 'Editor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    nullable: true,
  })
  email: string

  @Column({ nullable: true })
  password: string

  @Column('boolean', { default: false })
  isEmailVerified = false

  @Column({ nullable: true })
  verifyEmailToken: string

  @Column({
    nullable: true,
  })
  profileImgUrl: string

  @Column({
    nullable: true,
  })
  age: number

  @Column({
    type: 'enum',
    enum: UserRole,
    nullable: true,
  })
  role: UserRole

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
