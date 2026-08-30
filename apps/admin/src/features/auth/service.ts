import { createAdminError } from '@/lib/errors';
import type {
  AdminAuthService,
  AdminAuthSession,
  AdminLoginInput,
} from './types';

/**
 * Auth application service placeholder.
 * Real NestJS JWT login/session will replace this implementation later.
 */
class PlaceholderAuthService implements AdminAuthService {
  async getSession(): Promise<AdminAuthSession | null> {
    return null;
  }

  async login(_input: AdminLoginInput): Promise<AdminAuthSession> {
    void _input;
    throw createAdminError('UNAUTHORIZED', {
      message: 'Admin authentication is not implemented yet',
      userMessage: 'تسجيل الدخول غير مفعّل بعد في لوحة التحكم.',
    });
  }

  async logout(): Promise<void> {
    return;
  }
}

let authService: AdminAuthService | null = null;

export function getAuthService(): AdminAuthService {
  if (!authService) {
    authService = new PlaceholderAuthService();
  }

  return authService;
}

export async function getAdminSession(): Promise<AdminAuthSession | null> {
  return getAuthService().getSession();
}
