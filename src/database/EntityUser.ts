import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum AuthJWTUserLoginType {
  // 'Custom' value is used to refer into different table `user`
  Custom = 'Custom',
  Google = 'Google',
}

export enum UserLoginType {
  Google = 'Google',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  email: string

  @Column({ nullable: true })
  bio: string

  @Column({
    type: 'enum',
    enum: UserLoginType,
  })
  loginType: UserLoginType

  @Column({ unique: true })
  nickName: string

  @Column({ unique: true })
  externalServiceId: string

  @Column({ nullable: true })
  profileImg: string

  @Column({ nullable: true })
  refreshToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
