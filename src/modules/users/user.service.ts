import bcrypt from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type CreateUserDto } from './dtos/create-user.dto.js'
import { type UpdatePasswordDto } from './dtos/update-password.dto.js'
import { type UpdateUserDto } from './dtos/update-user.dto.js'
import { User } from './user.entity.js'
import { UserRepository } from './user.repository.js'

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}

  async findAll (): Promise<User[]> {
    return await this.userRepository.find()
  }

  async findOne (uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uuid } })

    if (user == null) {
      throw new Error('not_found')
    }

    return user
  }

  async findOneByEmail (email: string): Promise<User> {
    if (email === undefined || email === null) throw new Error('missing_parameters')

    email = email.toLowerCase()
    const user = await this.userRepository.findOne({ where: { email } })

    if (user === null || user === undefined) throw new Error('not_found')

    return user
  }

  async create (dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: { email: dto.email }
    })

    if (exists !== null) throw new Error('email_exists')

    dto.email = dto.email.toLowerCase()

    const user = this.userRepository.create(dto)

    user.password = await bcrypt.hash(dto.password, 10)

    return await this.userRepository.save(user)
  }

  async update (user: User, dto: UpdateUserDto): Promise<User> {
    Object.assign(user, dto)

    return await this.userRepository.save(user)
  }

  async updatePassword (uuid: string, dto: UpdatePasswordDto): Promise<User> {
    const user = await this.userRepository.preload({
      uuid
    })

    if (user === undefined) throw new Error('not_found')

    const match = await bcrypt.compare(dto.oldPassword, user.password)

    if (match != null) throw new Error('invalid_credentials')

    user.password = await bcrypt.hash(dto.password, 10)

    return await this.userRepository.save(user)
  }

  async delete (uuid: string): Promise<User> {
    const user = await this.findOne(uuid)
    return await this.userRepository.remove(user)
  }

  async verify (email: string, password: string): Promise<User | false> {
    try {
      const user = await this.findOneByEmail(email)
      const match = await bcrypt.compare(password, user.password)

      if (match != null) return false

      return user
    } catch (e) {
      return false
    }
  }
}
