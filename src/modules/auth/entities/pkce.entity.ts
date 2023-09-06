import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Pkce {
  @PrimaryColumn('uuid')
  uuid: string

  @Column({ type: 'varchar' })
  challengeMethod: string

  @Column({ type: 'varchar' })
  challenge: string

  @Column({ type: 'varchar' })
  verifier: string

  @Column({ type: 'varchar', nullable: true })
  csrfToken: string | null

  @Column({ type: 'varchar', array: true })
  scopes: string[]
}
