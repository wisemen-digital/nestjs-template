import { EntityManager, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Client } from '../entities/client.entity.js'

@Injectable()
export class ClientRepository extends Repository<Client> {
  constructor (@InjectEntityManager() entityManager: EntityManager) {
    super(Client, entityManager)
  }
}
