import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { RefreshToken } from '../entities/refreshtoken.entity.js'

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(RefreshToken, entityManager)
  }
}
