import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { User } from '../entities/user.entity.js'
import { TokenService } from '../../auth/services/token.service.js'
import { ClientSeeder } from '../../auth/tests/client.seeder.js'
import { UserRepository } from '../repositories/user.repository.js'
import { Client } from '../../auth/entities/client.entity.js'
import { RefreshToken } from '../../auth/entities/refreshtoken.entity.js'
import { ClientRepository } from '../../auth/repositories/client.repository.js'
import { RefreshTokenRepository } from '../../auth/repositories/refresh-token.repository.js'
import { UserSeeder } from './user.seeder.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: () => {
        if (process.env.RSA_PRIVATE == null || process.env.RSA_PUBLIC == null) {
          throw new Error('RSA_PRIVATE or RSA_PUBLIC not set in environment')
        }

        return {
          privateKey: Buffer.from(process.env.RSA_PRIVATE, 'base64').toString(),
          publicKey: Buffer.from(process.env.RSA_PUBLIC, 'base64').toString()
        }
      }
    })
  ],
  providers: [
    UserSeeder,
    TokenService,
    ClientSeeder,
    UserRepository,
    ClientRepository,
    RefreshTokenRepository
  ],
  exports: [UserSeeder, JwtModule]
})
export class UserSeederModule {}
