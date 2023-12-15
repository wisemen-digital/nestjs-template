import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '../entities/user.entity.js'

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor (private readonly reflector: Reflector) {}

  canActivate (context: ExecutionContext): boolean {
    const { auth, params } = context.switchToHttp().getRequest()

    if (auth.user.uuid === params.user || auth.user.role === Role.ADMIN) {
      return true
    }

    return false
  }
}
