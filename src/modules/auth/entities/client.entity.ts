import { Column, CreateDateColumn, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation, UpdateDateColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity.js'

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  get id (): string {
    return this.uuid
  }

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'uuid' })
  @Generated('uuid')
  secret: string

  @Column({ type: 'varchar', nullable: true, array: true })
  redirectUris: string[]

  @Column({ type: 'varchar', nullable: true, array: true })
  scopes: string[]

  grants: string[]

  @Column({ type: 'varchar', nullable: true })
  @Index()
  userUuid: string

  @ManyToOne(() => User, user => user.clients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userUuid' })
  user: Relation<User>

  validateScopes (scopes: string[]): boolean {
    return scopes.every(scope => this.scopes.includes(scope))
  }
}
