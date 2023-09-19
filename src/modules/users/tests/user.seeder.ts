import { Injectable } from '@nestjs/common'
import { randEmail, randFirstName, randLastName, randPassword } from '@ngneat/falso'
import bcrypt from 'bcryptjs'
import { type SeederOptions } from '../../../../test/utils/setup.js'
import { type User, type Role } from '../entities/user.entity.js'
import { type Client } from '../../auth/entities/client.entity.js'
import { TokenService } from '../../auth/services/token.service.js'
import { ClientSeeder } from '../../auth/tests/client.seeder.js'
import { UserRepository } from '../repositories/user.repository.js'

export interface UserSeederOptions extends SeederOptions {
  password?: string | null
  role?: Role | null
  companyName?: string | null
  email?: string | null
}

@Injectable()
export class UserSeeder {
  constructor (
    private readonly tokenService: TokenService,
    private readonly clientSeeder: ClientSeeder,
    private readonly userRepository: UserRepository
  ) {}

  async setupUser (role?: Role): Promise<{
    user: User
    client: Client
    token: string
  }> {
    const client = await this.clientSeeder.getTestClient()

    const user = await this.createRandomUser({ save: true }, role)

    const token = await this.tokenService.generateAccessToken(client, user, ['read', 'write'])

    return { user, client, token }
  }

  async createRandomUser (options?: UserSeederOptions, role?: Role): Promise<User> {
    const password = randPassword()

    const user = this.userRepository.create({
      email: randEmail(),
      password: await bcrypt.hash(password, 10),
      firstName: randFirstName(),
      lastName: randLastName(),
      role
    })

    if (options?.save === true) {
      await this.userRepository.save(user)
    }

    return user
  }
}
