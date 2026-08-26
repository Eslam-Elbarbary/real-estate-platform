import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { AlertResponseDto, toAlertResponse } from './mapper/alert.mapper';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAlertDto): Promise<AlertResponseDto> {
    const alert = await this.prisma.savedSearchAlert.create({
      data: {
        userId,
        name: dto.name.trim(),
        filters: dto.filters as Prisma.InputJsonValue,
      },
    });
    return toAlertResponse(alert);
  }

  async list(userId: string): Promise<AlertResponseDto[]> {
    const alerts = await this.prisma.savedSearchAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return alerts.map(toAlertResponse);
  }

  async update(
    userId: string,
    alertId: string,
    dto: UpdateAlertDto,
  ): Promise<AlertResponseDto> {
    await this.findOwnedOrThrow(userId, alertId);

    const data: Prisma.SavedSearchAlertUpdateInput = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.filters !== undefined) {
      data.filters = dto.filters as Prisma.InputJsonValue;
    }
    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    const updated = await this.prisma.savedSearchAlert.update({
      where: { id: alertId },
      data,
    });

    return toAlertResponse(updated);
  }

  async remove(userId: string, alertId: string): Promise<{ message: string }> {
    await this.findOwnedOrThrow(userId, alertId);
    await this.prisma.savedSearchAlert.delete({ where: { id: alertId } });
    return { message: 'Alert deleted' };
  }

  private async findOwnedOrThrow(userId: string, alertId: string) {
    const alert = await this.prisma.savedSearchAlert.findFirst({
      where: { id: alertId, userId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    return alert;
  }
}
