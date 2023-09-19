import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Pkce } from '../entities/pkce.entity.js'

@Injectable()
export class PkceRepository extends Repository<Pkce> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Pkce, entityManager)
  }
}
