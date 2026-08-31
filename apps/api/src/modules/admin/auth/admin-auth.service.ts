import { ForbiddenException, Injectable } from '@nestjs/common';
import { RoleCode } from '@prisma/client';
import { AuthService, RequestMeta } from '../../auth/auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

const ADMIN_ROLE_CODES: readonly string[] = [
  'SUPER_ADMIN',
  RoleCode.ADMIN,
  RoleCode.MODERATOR,
];

@Injectable()
export class AdminAuthService {
  constructor(private readonly authService: AuthService) {}

  async login(dto: AdminLoginDto, meta: RequestMeta = {}) {
    const result = await this.authService.login(dto, meta);

    if (!this.hasAdminRole(result.user.roles)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return result;
  }

  me(userId: string) {
    return this.authService.me(userId);
  }

  private hasAdminRole(roles: string[] | undefined): boolean {
    return (roles ?? []).some((role) => ADMIN_ROLE_CODES.includes(role));
  }
}
