import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserPermissionsService } from '../../modules/permissions/user-permissions.service';
import { UserRolesService } from '../../modules/permissions/user-roles.service';

export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly userPermissionsService: UserPermissionsService,
    private readonly userRolesService: UserRolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { sub?: string; roles?: string[] };
      method?: string;
      url?: string;
    }>();
    const userId = request.user?.sub;
    const userRoles = request.user?.roles ?? [];

    if (userId && (await this.userRolesService.hasSuperAdminRole(userId))) {
      this.logDevelopment('Bypass super admin', request, requiredPermissions, userId);
      return true;
    }

    if (!userId) {
      this.logDevelopment('Denied anonymous', request, requiredPermissions, userId);
      throw new ForbiddenException('Insufficient permissions');
    }

    const userPermissions =
      await this.userPermissionsService.getPermissionCodesForUser(userId);

    const allowed = requiredPermissions.some((permission) =>
      userPermissions.has(permission),
    );

    if (!allowed) {
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn(
          `Access denied ${request.method ?? 'UNKNOWN'} ${request.url ?? ''} — user=${userId} roles=[${userRoles.join(', ')}] required=[${requiredPermissions.join(', ')}] effective=[${[...userPermissions].join(', ')}]`,
        );
      }
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logDevelopment('Allowed', request, requiredPermissions, userId, userPermissions);
    return true;
  }

  private logDevelopment(
    outcome: string,
    request: { method?: string; url?: string },
    requiredPermissions: string[],
    userId?: string,
    userPermissions?: Set<string>,
  ): void {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    this.logger.debug(
      `${outcome} ${request.method ?? 'UNKNOWN'} ${request.url ?? ''} — user=${userId ?? 'anonymous'} required=[${requiredPermissions.join(', ')}]${userPermissions ? ` effective=[${[...userPermissions].join(', ')}]` : ''}`,
    );
  }
}
