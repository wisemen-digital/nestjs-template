import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Permissions, Public } from '../permissions/permissions.decorator.js'
import { Permission } from '../permissions/permission.enum.js'
import { CreateUserDto } from './dtos/create-user.dto.js'
import { UpdatePasswordDto } from './dtos/update-password.dto.js'
import { UpdateUserDto } from './dtos/update-user.dto.js'
import { UserService } from './user.service.js'
import { type UserTransformerType, UserTransformer } from './user.transformer.js'

@Controller('users')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Post()
  @Public()
  async createUser (
    @Body() createUserDto: CreateUserDto
  ): Promise<UserTransformerType> {
    const user = await this.userService.create(createUserDto)

    return new UserTransformer().item(user)
  }

  @Get()
  @Permissions(Permission.USER_READ)
  async getUsers (): Promise<UserTransformerType[]> {
    const users = await this.userService.findAll()

    return new UserTransformer().array(users)
  }

  @Get(':user')
  async getUser (@Param('user') userUuid: string): Promise<UserTransformerType> {
    const user = await this.userService.findOne(userUuid)

    return new UserTransformer().item(user)
  }

  @Post(':user')
  async updateUser (
    @Param('user') userUuid: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserTransformerType> {
    const user = await this.userService.findOne(userUuid)

    await this.userService.update(user, updateUserDto)

    return new UserTransformer().item(user)
  }

  @Delete(':user')
  async deleteUser (@Param('user') userUuid: string): Promise<void> {
    const user = await this.userService.findOne(userUuid)

    await this.userService.delete(user.uuid)
  }

  @Post(':user/password')
  async updateUserPassword (
    @Param('user') userUuid: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    const user = await this.userService.findOne(userUuid)

    await this.userService.updatePassword(user.uuid, updatePasswordDto)
  }
}
