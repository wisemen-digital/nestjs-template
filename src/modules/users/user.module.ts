import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller.js'
import { UserService } from './user.service.js'
import { User } from './user.entity.js'
import { UserRepository } from './user.repository.js'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
