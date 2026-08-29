import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Notification, NotificationType, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  NotificationResponseDto,
  toNotificationResponse,
} from './mapper/notification.mapper';

type NotificationData = Prisma.InputJsonObject;

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  data?: NotificationData;
  /** Stable key stored in data.eventKey for idempotent creation. */
  eventKey?: string;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications.map(toNotificationResponse);
  }

  async markRead(
    userId: string,
    notificationId: string,
  ): Promise<NotificationResponseDto> {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.isRead) {
      return toNotificationResponse(notification);
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return toNotificationResponse(updated);
  }

  async markAllRead(userId: string): Promise<{ message: string; count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      message: 'All notifications marked as read',
      count: result.count,
    };
  }

  /**
   * Creates a notification once per eventKey (application-level deduplication).
   * Failures are logged and swallowed so callers' core transactions are not affected.
   */
  async createOnce(input: CreateNotificationInput): Promise<Notification | null> {
    try {
      if (input.eventKey) {
        const existing = await this.prisma.notification.findFirst({
          where: {
            userId: input.userId,
            type: input.type,
            data: {
              path: ['eventKey'],
              equals: input.eventKey,
            },
          },
        });

        if (existing) {
          return existing;
        }
      }

      const data: NotificationData = {
        ...(input.data ?? {}),
        ...(input.eventKey ? { eventKey: input.eventKey } : {}),
      };

      return await this.prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          body: input.body ?? null,
          data: Object.keys(data).length > 0 ? data : undefined,
        },
      });
    } catch (error) {
      this.logger.warn(
        `Failed to create notification (${input.eventKey ?? input.type}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }

  async notifyPropertyApproved(params: {
    ownerId: string;
    propertyId: string;
    propertySlug: string;
  }): Promise<void> {
    await this.createOnce({
      userId: params.ownerId,
      type: NotificationType.PROPERTY,
      title: 'تم قبول عقارك',
      body: 'تمت الموافقة على عقارك وأصبح منشورًا على المنصة.',
      eventKey: `property:approved:${params.propertyId}`,
      data: {
        propertyId: params.propertyId,
        propertySlug: params.propertySlug,
        actionUrl: `/properties/${params.propertySlug}`,
      },
    });
  }

  async notifyPropertyRejected(params: {
    ownerId: string;
    propertyId: string;
    propertySlug: string;
    reason: string;
    reviewedAt: string;
  }): Promise<void> {
    await this.createOnce({
      userId: params.ownerId,
      type: NotificationType.PROPERTY,
      title: 'تم رفض عقارك',
      body: 'تم رفض عقارك للمراجعة. يرجى مراجعة سبب الرفض وإجراء التعديلات المطلوبة.',
      eventKey: `property:rejected:${params.propertyId}:${params.reviewedAt}`,
      data: {
        propertyId: params.propertyId,
        propertySlug: params.propertySlug,
        rejectionReason: params.reason,
        actionUrl: `/properties/me/${params.propertyId}`,
      },
    });
  }

  async notifyPaymentSuccess(params: {
    ownerId: string;
    propertyId: string;
    propertySlug: string;
    paymentId: string;
  }): Promise<void> {
    await this.createOnce({
      userId: params.ownerId,
      type: NotificationType.PAYMENT,
      title: 'تم الدفع بنجاح',
      body: 'تم تأكيد الدفع بنجاح، وتم إرسال عقارك للمراجعة.',
      eventKey: `payment:success:${params.paymentId}`,
      data: {
        propertyId: params.propertyId,
        propertySlug: params.propertySlug,
        paymentId: params.paymentId,
        actionUrl: `/properties/me/${params.propertyId}`,
      },
    });
  }

  async notifyNewLead(params: {
    ownerId: string;
    propertyId: string;
    propertySlug: string;
    leadId: string;
  }): Promise<void> {
    await this.createOnce({
      userId: params.ownerId,
      type: NotificationType.LEAD,
      title: 'استفسار جديد على عقارك',
      body: 'لديك استفسار جديد من أحد المهتمين بعقارك.',
      eventKey: `lead:created:${params.leadId}`,
      data: {
        propertyId: params.propertyId,
        propertySlug: params.propertySlug,
        leadId: params.leadId,
        actionUrl: `/leads`,
      },
    });
  }

  async notifySubscriptionExpired(params: {
    ownerId: string;
    propertyId: string;
    propertySlug: string;
    subscriptionId: string;
  }): Promise<void> {
    await this.createOnce({
      userId: params.ownerId,
      type: NotificationType.SUBSCRIPTION,
      title: 'انتهت صلاحية اشتراكك',
      body: 'انتهت صلاحية خطة الإعلان الخاصة بعقارك. يرجى تجديد الخطة لإعادة نشر العقار.',
      eventKey: `subscription:expired:${params.subscriptionId}`,
      data: {
        propertyId: params.propertyId,
        propertySlug: params.propertySlug,
        subscriptionId: params.subscriptionId,
        actionUrl: `/properties/me/${params.propertyId}`,
      },
    });
  }

  async notifySavedSearchMatch(params: {
    userId: string;
    propertyId: string;
    propertySlug: string;
    alertId: string;
  }): Promise<void> {
    await this.createOnce({
      userId: params.userId,
      type: NotificationType.PROPERTY,
      title: 'عقار جديد يناسب بحثك',
      body: 'تم نشر عقار جديد يطابق معايير البحث المحفوظ.',
      eventKey: `alert:match:${params.alertId}:${params.propertyId}`,
      data: {
        propertyId: params.propertyId,
        propertySlug: params.propertySlug,
        alertId: params.alertId,
        actionUrl: `/properties/${params.propertySlug}`,
      },
    });
  }
}
