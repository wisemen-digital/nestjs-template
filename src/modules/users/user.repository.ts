import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './user.entity.js'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor (@InjectRepository(User) repository: Repository<User>) {
    super(repository.target, repository.manager, repository.queryRunner)
  }
}
