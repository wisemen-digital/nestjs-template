import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import type { User } from '../entities/user.entity.js'

export class UserTransformerType {
  @ApiProperty()
  uuid: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  email: string

  @ApiProperty({ type: String, nullable: true })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true })
  lastName: string | null

  @ApiProperty()
  role: string
}

export interface ExistsTransformerType {
  exists: boolean
}

export class UserTransformer extends Transformer<User, UserTransformerType> {
  transform (user: User): UserTransformerType {
    return {
      uuid: user.uuid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  }
}
