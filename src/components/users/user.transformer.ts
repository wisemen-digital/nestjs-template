import { Transformer } from '@appwise/transformer';
import type { User } from './user.entity.js';

export interface UserTransformerType {
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface ExistsTransformerType {
  exists: boolean;
}

export class UserTransformer extends Transformer<User, UserTransformerType> {
  transform(user: User): UserTransformerType {
    return {
      uuid: user.uuid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }
}
