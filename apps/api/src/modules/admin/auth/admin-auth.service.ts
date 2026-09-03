import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService, RequestMeta } from '../../auth/auth.service';
import { UserPermissionsService } from '../../permissions/user-permissions.service';
import { UserRolesService } from '../../permissions/user-roles.service';
import { AdminLoginDto } from './dto/admin-login.dto';

export type AdminAuthUserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone?: string | null;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
};

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRolesService: UserRolesService,
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  async login(dto: AdminLoginDto, meta: RequestMeta = {}) {
    const result = await this.authService.login(dto, meta);

    if (!(await this.userRolesService.hasAdminRole(result.user.id))) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const user = await this.buildAdminUserProfile(result.user.id, {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      phone: result.user.phone,
      roles: result.user.roles,
    });

    return {
      ...result,
      user,
    };
  }

  async me(userId: string): Promise<AdminAuthUserProfile> {
    const base = await this.authService.me(userId);
    return this.buildAdminUserProfile(userId, base);
  }

  private async buildAdminUserProfile(
    userId: string,
    user: {
      id: string;
      email: string;
      name: string | null;
      phone?: string | null;
      roles: string[];
    },
  ): Promise<AdminAuthUserProfile> {
    const [permissionSet, isAdmin] = await Promise.all([
      this.userPermissionsService.getPermissionCodesForUser(userId),
      this.userRolesService.hasAdminRole(userId),
    ]);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone ?? null,
      roles: user.roles,
      permissions: [...permissionSet].sort(),
      isAdmin,
    };
  }
}
