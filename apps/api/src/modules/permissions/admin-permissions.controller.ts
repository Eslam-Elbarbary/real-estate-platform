import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../../common/decorators';
import { AdminPermissionDto } from './mapper/permission.mapper';
import { PermissionsCatalogService } from './permissions-catalog.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/permissions')
export class AdminPermissionsController {
  constructor(
    private readonly permissionsCatalogService: PermissionsCatalogService,
  ) {}

  @Get()
  @Permissions('roles.view')
  @ApiOperation({
    summary: 'List all permissions for admin role management',
  })
  @ApiOkResponse({ type: AdminPermissionDto, isArray: true })
  listPermissions(): Promise<AdminPermissionDto[]> {
    return this.permissionsCatalogService.listAdmin();
  }
}
