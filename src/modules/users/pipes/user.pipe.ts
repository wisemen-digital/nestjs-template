import { type PipeTransform, Injectable, Scope, type ArgumentMetadata, Inject, HttpException } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import validator from 'validator'
import { type OAuth2Server } from '@appwise/oauth2-server'
import { UserService } from '../services/user.service.js'
import { Role, type User } from '../entities/user.entity.js'
import { type Client } from '../../auth/entities/client.entity.js'

interface OurToken extends OAuth2Server.Token {
  user: User
  client: Client
  scope: string[]
}

export interface Request {
  auth: OurToken
}

@Injectable({ scope: Scope.REQUEST })
export class UserValidationPipe implements PipeTransform {
  constructor (
    @Inject(REQUEST) protected readonly request: Request,
    private readonly userService: UserService
  ) {
  }

  async transform (value: unknown, _metadata: ArgumentMetadata): Promise<string> {
    const uuid = value as string
    if (validator.isUUID(uuid) === false) throw new HttpException('invalid_uuid', 400)

    const user = await this.userService.findOne(uuid)

    if (
      this.request.auth.user.uuid !== user.uuid &&
      this.request.auth.user.role !== Role.ADMIN
    ) {
      throw new HttpException('forbidden', 403)
    }

    return uuid
  }
}
