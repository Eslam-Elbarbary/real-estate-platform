import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../../common/decorators';
import { AdminService } from '../admin.service';
import { AdminDashboardStatsDto } from '../mapper/admin-dashboard.mapper';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin/dashboard')
@Permissions('dashboard.view')
export class AdminDashboardController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Admin dashboard overview statistics' })
  getDashboard(): Promise<AdminDashboardStatsDto> {
    return this.adminService.getDashboardStats();
  }
}
