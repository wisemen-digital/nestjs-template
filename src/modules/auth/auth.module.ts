import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity.js';
import { Pkce } from './entities/pkce.entity.js';
import { RefreshToken } from './entities/refreshtoken.entity.js';
import { ClientService } from './services/client.service.js';
import { PkceService } from './services/pkce.service.js';
import { TokenService } from './services/token.service.js';
import { User } from '../users/user.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, Pkce, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: () => ({
        privateKey: Buffer.from(process.env.RSA_PRIVATE, 'base64').toString(),
        publicKey: Buffer.from(process.env.RSA_PUBLIC, 'base64').toString(),
      })
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    ClientService,
    PkceService,
    TokenService,
  ],
})

export class AuthModule {}
