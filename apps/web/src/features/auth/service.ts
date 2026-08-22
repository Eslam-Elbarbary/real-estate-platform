import {
  completeDemoSessionAction,
  getSessionAction,
  loginWithCredentialsAction,
  loginWithMagicLinkAction,
  logoutAction,
  registerAction,
} from './actions';
import { getServerSession } from './session';
import type {
  AuthService,
  LoginCredentialsInput,
  MagicLinkInput,
  RegisterInput,
} from './types';

/**
 * Frontend-demo auth service. Replace with Express/API-backed implementation later.
 */
export class MockAuthService implements AuthService {
  async getSession() {
    return getServerSession();
  }

  async loginWithCredentials(input: LoginCredentialsInput) {
    const result = await loginWithCredentialsAction(input);
    if (!result.ok) {
      throw new Error(result.error);
    }
    const session = await getServerSession();
    if (!session) {
      throw new Error('تعذر إنشاء جلسة العرض');
    }
    return session;
  }

  async loginWithMagicLink(input: MagicLinkInput) {
    await loginWithMagicLinkAction(input);
    return { sent: true as const };
  }

  async register(input: RegisterInput) {
    const result = await registerAction(input);
    if (!result.ok) {
      const message = Object.values(result.fieldErrors)[0] ?? 'تعذر إنشاء الحساب';
      throw new Error(message);
    }
    return { needsVerification: true as const };
  }

  async logout() {
    await logoutAction();
  }
}

let authService: AuthService | null = null;

export function getAuthService(): AuthService {
  if (!authService) {
    authService = new MockAuthService();
  }
  return authService;
}

export {
  completeDemoSessionAction,
  getSessionAction,
  loginWithCredentialsAction,
  loginWithMagicLinkAction,
  logoutAction,
  registerAction,
};
