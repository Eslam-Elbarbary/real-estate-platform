import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Notification } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiProperty()
  read!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export function toNotificationResponse(
  notification: Notification,
): NotificationResponseDto {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.body,
    read: notification.isRead,
    createdAt: notification.createdAt,
  };
}
