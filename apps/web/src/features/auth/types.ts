export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  /** Derived display name: first + last, or email. */
  name: string;
  phone: string | null;
  roles: string[];
  permissions: string[];
  avatarUrl?: string | null;
  isEmailVerified?: boolean;
}

export interface AuthSession {
  authenticated: true;
  user: AuthUser;
}

export interface LoginCredentialsInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** @deprecated Prefer LoginCredentialsInput.email */
export interface LoginCredentialsLegacyInput {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthService {
  getSession(): Promise<AuthSession | null>;
  loginWithCredentials(input: LoginCredentialsInput): Promise<AuthSession>;
  register(input: RegisterInput): Promise<{ needsVerification: true }>;
  logout(): Promise<void>;
}
