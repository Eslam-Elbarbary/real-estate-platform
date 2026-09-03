import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { Permissions } from '../../common/decorators';
import { buildSuccessResponse } from '../../common/interfaces/api-response.interface';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe';
import { CreateRoleDto } from './dto/create-role.dto';
import { ListRolesQueryDto } from './dto/list-roles-query.dto';
import { SetRolePermissionsDto } from './dto/set-role-permissions.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AdminRoleDetailsDto, AdminRoleListItemDto } from './mapper/role.mapper';
import { RolesService } from './roles.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles.view')
  @ApiOperation({ summary: 'List roles for admin management' })
  @ApiOkResponse({ type: AdminRoleListItemDto, isArray: true })
  async listRoles(@Query() query: ListRolesQueryDto, @Req() req: Request) {
    const result = await this.rolesService.listAdmin(query);
    return buildSuccessResponse<AdminRoleListItemDto[]>(
      result.data,
      'OK',
      req.url,
      result.meta,
    );
  }

  @Post()
  @Permissions('roles.create')
  @ApiOperation({ summary: 'Create a role' })
  @ApiCreatedResponse({ type: AdminRoleDetailsDto })
  createRole(@Body() dto: CreateRoleDto): Promise<AdminRoleDetailsDto> {
    return this.rolesService.createAdmin(dto);
  }

  @Get(':id')
  @Permissions('roles.view')
  @ApiOperation({ summary: 'Get role details for admin management' })
  @ApiOkResponse({ type: AdminRoleDetailsDto })
  getRole(@Param('id', ParseIdPipe) id: string): Promise<AdminRoleDetailsDto> {
    return this.rolesService.getAdminById(id);
  }

  @Patch(':id')
  @Permissions('roles.update')
  @ApiOperation({ summary: 'Update a role' })
  @ApiOkResponse({ type: AdminRoleDetailsDto })
  updateRole(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ): Promise<AdminRoleDetailsDto> {
    return this.rolesService.updateAdmin(id, dto);
  }

  @Delete(':id')
  @Permissions('roles.delete')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiOkResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Role deleted successfully' },
      },
    },
  })
  deleteRole(@Param('id', ParseIdPipe) id: string) {
    return this.rolesService.deleteAdmin(id);
  }

  @Put(':id/permissions')
  @Permissions('roles.manage_permissions')
  @ApiOperation({ summary: 'Replace permission mappings for a role' })
  @ApiOkResponse({ type: AdminRoleDetailsDto })
  setRolePermissions(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: SetRolePermissionsDto,
  ): Promise<AdminRoleDetailsDto> {
    return this.rolesService.setPermissions(id, dto);
  }
}
