import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PermissionsGuard } from './permissions.guard';
import type { UserPermissionsService } from '../../modules/permissions/user-permissions.service';
import type { UserRolesService } from '../../modules/permissions/user-roles.service';

function createContext(user?: { sub?: string; roles?: string[] }): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user,
        method: 'GET',
        url: '/test',
      }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;
}

describe('PermissionsGuard', () => {
  let reflector: Reflector;
  let userPermissionsService: jest.Mocked<
    Pick<UserPermissionsService, 'getPermissionCodesForUser'>
  >;
  let userRolesService: jest.Mocked<Pick<UserRolesService, 'hasSuperAdminRole'>>;
  let guard: PermissionsGuard;

  beforeEach(() => {
    reflector = new Reflector();
    userPermissionsService = {
      getPermissionCodesForUser: jest.fn(),
    };
    userRolesService = {
      hasSuperAdminRole: jest.fn().mockResolvedValue(false),
    };
    guard = new PermissionsGuard(
      reflector,
      userPermissionsService as unknown as UserPermissionsService,
      userRolesService as unknown as UserRolesService,
    );
  });

  it('allows routes without @Permissions metadata', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(userPermissionsService.getPermissionCodesForUser).not.toHaveBeenCalled();
    expect(userRolesService.hasSuperAdminRole).not.toHaveBeenCalled();
  });

  it('allows super admin via role metadata without loading permissions', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['properties.approve']);
    userRolesService.hasSuperAdminRole.mockResolvedValue(true);

    await expect(
      guard.canActivate(
        createContext({ sub: 'user-1', roles: ['SUPER_ADMIN'] }),
      ),
    ).resolves.toBe(true);

    expect(userRolesService.hasSuperAdminRole).toHaveBeenCalledWith('user-1');
    expect(userPermissionsService.getPermissionCodesForUser).not.toHaveBeenCalled();
  });

  it('allows when user has a required permission', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['properties.approve']);
    userPermissionsService.getPermissionCodesForUser.mockResolvedValue(
      new Set(['properties.view', 'properties.approve']),
    );

    await expect(
      guard.canActivate(createContext({ sub: 'user-2', roles: ['MODERATOR'] })),
    ).resolves.toBe(true);
  });

  it('throws when user lacks required permissions', async () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['properties.create']);
    userPermissionsService.getPermissionCodesForUser.mockResolvedValue(
      new Set(['properties.view']),
    );

    await expect(
      guard.canActivate(createContext({ sub: 'user-3', roles: ['MODERATOR'] })),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('reads permission metadata from handler and class', async () => {
    const getAllAndOverride = jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([]);
    const context = createContext({ sub: 'user-4', roles: ['ADMIN'] });

    await guard.canActivate(context);

    expect(getAllAndOverride).toHaveBeenCalledWith(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  });
});
