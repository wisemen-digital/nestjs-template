import { Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { type Role } from '../../users/entities/user.entity.js'
import { ROLES_KEY } from '../../permissions/permissions.decorator.js'

@Injectable()
export class RoleGuard implements CanActivate {
  constructor (private readonly reflector: Reflector) {}

  canActivate (context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (requiredRoles == null) {
      return true
    }

    const { auth } = context.switchToHttp().getRequest()

    if (auth != null) {
      if (requiredRoles.includes(auth.user.role)) {
        return true
      }
    }

    return false
  }
}
