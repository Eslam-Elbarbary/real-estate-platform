export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSinceLabel: string;
  /** When true, profile UI may show a verified phone affordance. */
  phoneVerified?: boolean;
  /** UI-only commercial role label, e.g. مالك عقار. */
  displayRoleLabel?: string;
  avatarUrl?: string;
}

export interface AuthSession {
  authenticated: true;
  user: AuthUser;
}

export interface LoginCredentialsInput {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface MagicLinkInput {
  identifier: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthService {
  getSession(): Promise<AuthSession | null>;
  loginWithCredentials(input: LoginCredentialsInput): Promise<AuthSession>;
  loginWithMagicLink(input: MagicLinkInput): Promise<{ sent: true }>;
  register(input: RegisterInput): Promise<{ needsVerification: true }>;
  logout(): Promise<void>;
}
