import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../users/user.module.js'
import { User } from '../users/user.entity.js'
import { AuthController } from './auth.controller.js'
import { Client } from './entities/client.entity.js'
import { Pkce } from './entities/pkce.entity.js'
import { RefreshToken } from './entities/refreshtoken.entity.js'
import { ClientService } from './services/client.service.js'
import { PkceService } from './services/pkce.service.js'
import { TokenService } from './services/token.service.js'
import { AuthService } from './auth.service.js'
import { AuthGuard } from './auth.guard.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, Pkce, RefreshToken]),
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
    }),
    UserModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ClientService,
    PkceService,
    TokenService,
    AuthGuard
  ],
  exports: [
    AuthService
  ]
})

export class AuthModule {}
