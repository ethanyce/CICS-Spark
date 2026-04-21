import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService, Permission } from './permissions.service';
import { PERMISSION_KEY } from './require-permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<Permission>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true; // No permission required
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Super admins bypass permission checks
    if (user.role === 'super_admin') {
      return true;
    }

    // Check if user has the required permission
    const hasPermission = await this.permissionsService.hasPermission(user.id, requiredPermission);
    
    if (!hasPermission) {
      throw new ForbiddenException(`You don't have permission: ${requiredPermission}`);
    }

    return true;
  }
}
