import {
  getSessionAction,
  loginAction,
  loginWithCredentialsAction,
  logoutAction,
  registerAction,
  verifyEmailAction,
  forgotPasswordAction,
  resetPasswordAction,
} from './actions';
import { getServerSession } from './session';
import type { AuthService, LoginCredentialsInput, RegisterInput } from './types';

/**
 * Auth service facade over server actions (API JWT session).
 */
export class ApiAuthService implements AuthService {
  async getSession() {
    return getServerSession();
  }

  async loginWithCredentials(input: LoginCredentialsInput) {
    const result = await loginAction(input);
    if (!result.ok) {
      throw new Error(result.error);
    }
    const session = await getServerSession();
    if (!session) {
      throw new Error('تعذر إنشاء الجلسة بعد تسجيل الدخول');
    }
    return session;
  }

  async register(input: RegisterInput) {
    const result = await registerAction(input);
    if (!result.ok) {
      const message =
        result.error ??
        Object.values(result.fieldErrors ?? {})[0] ??
        'تعذر إنشاء الحساب';
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
    authService = new ApiAuthService();
  }
  return authService;
}

export {
  getSessionAction,
  loginAction,
  loginWithCredentialsAction,
  logoutAction,
  registerAction,
  verifyEmailAction,
  forgotPasswordAction,
  resetPasswordAction,
};
