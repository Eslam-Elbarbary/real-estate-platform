import type { UserNotification } from '../types';

export interface NotificationsRepository {
  list(userId: string): Promise<UserNotification[]>;
}

/** Default empty — matches direct notifications reference. */
export class EmptyNotificationsRepository implements NotificationsRepository {
  async list(_userId: string): Promise<UserNotification[]> {
    void _userId;
    return [];
  }
}

let notificationsRepository: NotificationsRepository | null = null;

export function getNotificationsRepository(): NotificationsRepository {
  if (!notificationsRepository) {
    notificationsRepository = new EmptyNotificationsRepository();
  }
  return notificationsRepository;
}

export class NotificationsService {
  constructor(private readonly repository = getNotificationsRepository()) {}

  list(userId: string): Promise<UserNotification[]> {
    return this.repository.list(userId);
  }
}

let notificationsService: NotificationsService | null = null;

export function getNotificationsService(): NotificationsService {
  if (!notificationsService) {
    notificationsService = new NotificationsService();
  }
  return notificationsService;
}
