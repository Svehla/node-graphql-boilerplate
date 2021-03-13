import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export enum UserLoginType {
  Google = 'Google',
}

@Entity('public_users')
export class PublicUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({
    type: 'enum',
    enum: UserLoginType,
  })
  loginType: UserLoginType

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
