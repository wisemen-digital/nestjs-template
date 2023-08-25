import { User } from '../../users/user.entity.js'
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from 'typeorm'
import { Client } from './client.entity.js'
import { signToken } from '../../../utils/token.js'

interface JwtPayload {
  tid: string
  uid: string
  cid: string
  scope: string[]
}

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt!: Date

  @DeleteDateColumn({ precision: 3 })
  deletedAt?: Date

  @Column({ type: 'timestamp', precision: 3 })
  expiresAt: Date

  @Column({ type: 'uuid' })
  userUuid: string

  @Column({ type: 'uuid' })
  clientUuid: string

  @Column('varchar', { array: true })
  scope: string[]

  @ManyToOne(() => User, user => user.tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userUuid' })
  user: Relation<User>

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientUuid' })
  client: Relation<Client>

  get expiresIn (): number {
    const diff = this.expiresAt.getTime() - Date.now()

    return Math.floor(diff / 1000)
  }

  get refreshToken (): string {
    return signToken<JwtPayload>({
      tid: this.uuid,
      cid: this.clientUuid,
      uid: this.userUuid,
      scope: this.scope
    }, {
      expiresIn: this.expiresIn
    })
  }

  get refreshTokenExpiresAt (): Date {
    return this.expiresAt
  }

  static get lifetime (): number {
    const value = Number(process.env.REFRESH_TOKEN_LIFETIME)

    if (isNaN(value)) return 365 * 24 * 3600
    else return value
  }
}
