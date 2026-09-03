import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  AdminPermissionDto,
  toAdminPermission,
} from './mapper/permission.mapper';

@Injectable()
export class PermissionsCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listAdmin(): Promise<AdminPermissionDto[]> {
    const permissions = await this.prisma.permission.findMany({
      orderBy: [{ code: 'asc' }],
    });

    return permissions.map(toAdminPermission);
  }
}
