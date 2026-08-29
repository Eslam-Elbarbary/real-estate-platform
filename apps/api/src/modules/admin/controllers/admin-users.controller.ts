import { Body, Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleCode } from '@prisma/client';
import { Request } from 'express';
import { CurrentUser, Roles } from '../../../common/decorators';
import type { AuthUserPayload } from '../../../common/decorators';
import { buildSuccessResponse } from '../../../common/interfaces/api-response.interface';
import { AdminUsersService } from '../admin-users.service';
import { ListAdminUsersQueryDto } from '../dto/list-admin-users-query.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { AdminUserDetailsDto, AdminUserListItemDto } from '../mapper/admin-user.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/users')
@Roles(RoleCode.ADMIN)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
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

  @Get(':id')
  @ApiOperation({ summary: 'Get user details for admin management' })
  getUserDetails(@Param('id') id: string): Promise<AdminUserDetailsDto> {
    return this.adminUsersService.getUserDetails(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or deactivate a user account' })
  updateUserStatus(
    @CurrentUser() user: AuthUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ): Promise<AdminUserDetailsDto> {
    return this.adminUsersService.updateUserStatus(user.sub, id, dto.isActive);
  }
}
