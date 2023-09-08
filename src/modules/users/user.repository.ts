import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { User } from './user.entity.js'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(User, entityManager)
  }
}
