export interface AdminAuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  isAdmin: boolean;
}

export interface AdminAuthSession {
  authenticated: true;
  user: AdminAuthUser;
  /** Present once JWT session storage is wired. */
  accessToken?: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export type AuthActionResult =
  | { ok: true }
  | { ok: false; error: string };

export interface AdminAuthService {
  getSession(): Promise<AdminAuthSession | null>;
  login(input: AdminLoginInput): Promise<AdminAuthSession>;
  logout(): Promise<void>;
}
