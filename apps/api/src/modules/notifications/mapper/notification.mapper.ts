import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Notification, NotificationType } from '@prisma/client';
import { Prisma } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: NotificationType })
  type!: NotificationType;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  message!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Safe client metadata (propertyId, actionUrl, etc.)',
  })
  data!: Prisma.JsonValue | null;

  @ApiProperty({ description: 'Whether the notification has been read' })
  read!: boolean;

  @ApiProperty()
  createdAt!: Date;
}

export function toNotificationResponse(
  notification: Notification,
): NotificationResponseDto {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.body,
    data: notification.data,
    read: notification.isRead,
    createdAt: notification.createdAt,
  };
}
