import { Transformer } from '@appwise/transformer'
import type { User } from '../entities/user.entity.js'

export class UserTransformerResponse {
  uuid: string
  createdAt: Date
  updatedAt: Date
  email: string
  firstName: string | null
  lastName: string | null
  role: string
}

// export interface UserTransformerType extends UserTransformerResponse {
// }

export class UserTransformer extends Transformer<User, UserTransformerResponse> {
  transform (user: User): UserTransformerResponse {
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
