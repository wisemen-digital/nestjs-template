import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Client } from '../entities/client.entity.js'
import { User } from '../../users/entities/user.entity.js'

// todo: remove duplicate code
export enum Scope {
  ALL = '*',
  READ = 'read',
  WRITE = 'write',
}

export const scopes = Object.values(Scope)

@Injectable()
export class ClientService {
  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getUserFromClient (client: Client): Promise<User | undefined> {
    if (client.userUuid === undefined) return

    if (client.user === undefined) {
      const user = await this.userRepository.findOneBy({ uuid: client.userUuid })

      if (user == null) {
        return
      }

      client.user = user
    }

    return client.user
  }

  async getClient (clientId: string, secret: string): Promise<Client | false> {
    try {
      const client = await this.clientRepository.findOne({
        where: { uuid: clientId }
      })

      if (client == null) {
        return false
      }

      if (secret == null && client?.secret !== secret) {
        return false
      }

      if (client?.scopes?.includes(Scope.ALL)) {
        client.scopes = scopes
      }

      client.grants = ['password', 'refresh_token', 'ad']

      return client
    } catch (e) {
      return false
    }
  }
}
