import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleCode } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Admin role inheritance: higher roles satisfy lower admin/moderator requirements.
 * USER, BROKER, and DEVELOPER use exact matching only.
 */
const ROLE_HIERARCHY: Partial<Record<RoleCode, readonly RoleCode[]>> = {
  [RoleCode.SUPER_ADMIN]: [
    RoleCode.SUPER_ADMIN,
    RoleCode.ADMIN,
    RoleCode.MODERATOR,
  ],
  [RoleCode.ADMIN]: [RoleCode.ADMIN, RoleCode.MODERATOR],
  [RoleCode.MODERATOR]: [RoleCode.MODERATOR],
};

function expandUserRoles(userRoles: string[]): Set<string> {
  const expanded = new Set<string>();

  for (const role of userRoles) {
    const inherited = ROLE_HIERARCHY[role as RoleCode];
    if (inherited) {
      for (const inheritedRole of inherited) {
        expanded.add(inheritedRole);
      }
    } else {
      expanded.add(role);
    }
  }

  return expanded;
}

/**
 * Role-based access guard — enforces @Roles() metadata after JWT authentication.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: { sub?: string; roles?: string[] };
      method?: string;
      url?: string;
    }>();
    const userRoles = request.user?.roles ?? [];
    const effectiveRoles = expandUserRoles(userRoles);

    const allowed = requiredRoles.some((role) => effectiveRoles.has(role));
    if (!allowed) {
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn(
          `Access denied ${request.method ?? 'UNKNOWN'} ${request.url ?? ''} — user=${request.user?.sub ?? 'anonymous'} roles=[${userRoles.join(', ')}] required=[${requiredRoles.join(', ')}] effective=[${[...effectiveRoles].join(', ')}]`,
        );
      }
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
