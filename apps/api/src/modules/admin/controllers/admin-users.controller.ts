import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser, Permissions } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { AdminUsersService } from '../admin-users.service';
import { AdminUserSelectQueryDto } from '../dto/admin-user-select-query.dto';
import { AssignUserRoleDto } from '../dto/assign-user-role.dto';
import { ListAdminUsersQueryDto } from '../dto/list-admin-users-query.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { AdminUserRoleDto } from '../mapper/admin-user-role.mapper';
import {
  AdminUserDetailsDto,
  AdminUserListItemDto,
  AdminUserSelectItemDto,
} from '../mapper/admin-user.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @Permissions('users.view')
  @ApiOperation({ summary: 'List users for admin management' })
  async listUsers(@Query() query: ListAdminUsersQueryDto, @Req() req: Request) {
    const result = await this.adminUsersService.listUsers(query);
    return buildSuccessResponse<AdminUserListItemDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Get('select')
  @Permissions('users.view')
  @ApiOperation({ summary: 'Search users for admin form selectors (e.g. property owner)' })
  @ApiOkResponse({ type: AdminUserSelectItemDto, isArray: true })
  async selectUsers(@Query() query: AdminUserSelectQueryDto, @Req() req: Request) {
    const data = await this.adminUsersService.selectUsers(query);
    return buildSuccessResponse<AdminUserSelectItemDto[]>(data, 'OK', req.url);
  }

  @Get(':id/roles')
  @Permissions('users.manage_roles')
  @ApiOperation({ summary: 'List roles assigned to a user' })
  @ApiOkResponse({ type: AdminUserRoleDto, isArray: true })
  listUserRoles(@Param('id') id: string): Promise<AdminUserRoleDto[]> {
    return this.adminUsersService.listUserRoles(id);
  }

  @Post(':id/roles')
  @Permissions('users.manage_roles')
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiCreatedResponse({ type: AdminUserRoleDto })
  assignUserRole(
    @CurrentUser() actor: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: AssignUserRoleDto,
  ): Promise<AdminUserRoleDto> {
    return this.adminUsersService.assignUserRole(actor.sub, id, dto.roleCode);
  }

  @Delete(':id/roles/:roleCode')
  @Permissions('users.manage_roles')
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiOkResponse({ type: AdminUserRoleDto })
  removeUserRole(
    @CurrentUser() actor: AuthUserPayload,
    @Param('id') id: string,
    @Param('roleCode') roleCode: string,
  ): Promise<AdminUserRoleDto> {
    return this.adminUsersService.removeUserRole(actor.sub, id, roleCode);
  }

  @Get(':id')
  @Permissions('users.view')
  @ApiOperation({ summary: 'Get user details for admin management' })
  getUserDetails(@Param('id') id: string): Promise<AdminUserDetailsDto> {
    return this.adminUsersService.getUserDetails(id);
  }

  @Patch(':id/status')
  @Permissions('users.update')
  @ApiOperation({ summary: 'Activate or deactivate a user account' })
  updateUserStatus(
    @CurrentUser() user: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<AdminUserDetailsDto> {
    return this.adminUsersService.updateUserStatus(user.sub, id, dto.isActive);
  }
}
