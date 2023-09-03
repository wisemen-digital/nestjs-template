
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from './permission.enum.js';
import { PERMISSIONS_KEY } from './permissions.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredPermissions) {
      return true
    }

    const { auth } = context.switchToHttp().getRequest()

    if (auth) {
      return true
    }

    // todo: check user permissions
    // return requiredPermissions.some((permission) => user.permissions?.includes(permission))
  }
}
