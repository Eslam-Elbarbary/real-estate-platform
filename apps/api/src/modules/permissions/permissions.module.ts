import { Module } from '@nestjs/common';
import { AdminPermissionsController } from './admin-permissions.controller';
import { PermissionsCatalogService } from './permissions-catalog.service';
import { UserPermissionsService } from './user-permissions.service';
import { UserRolesService } from './user-roles.service';

@Module({
  controllers: [AdminPermissionsController],
  providers: [
    UserPermissionsService,
    UserRolesService,
    PermissionsCatalogService,
  ],
  exports: [UserPermissionsService, UserRolesService, PermissionsCatalogService],
})
export class PermissionsModule {}
