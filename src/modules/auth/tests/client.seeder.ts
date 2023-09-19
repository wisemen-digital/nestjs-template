import { Injectable } from '@nestjs/common'
import { Client } from '../entities/client.entity.js'
import { ClientRepository } from '../repositories/client.repository.js'

@Injectable()
export class ClientSeeder {
  constructor (
    private readonly clientRepository: ClientRepository
  ) {}

  async getTestClient (): Promise<Client> {
    let client = await this.clientRepository.findOneBy({ name: 'test-env' })

    if (client === null) {
      client = new Client()
      client.name = 'test-env'
      client.scopes = ['read', 'write']

      await this.clientRepository.save(client)
    }

    return client
  }
}
