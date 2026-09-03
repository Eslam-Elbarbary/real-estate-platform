import 'server-only';

import { postJson } from '@/lib/api/client';

interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterResponseData {
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  message: string;
  verificationToken?: string;
}

export interface VerifyEmailResponseData {
  message: string;
}

const LOGIN_PATH = '/api/v1/auth/login';
const REGISTER_PATH = '/api/v1/auth/register';
const VERIFY_EMAIL_PATH = '/api/v1/auth/verify-email';

export async function loginWithApi(email: string, password: string) {
  return postJson<LoginResponseData, { email: string; password: string }>(
    LOGIN_PATH,
    { email: email.toLowerCase().trim(), password },
  );
}

export async function registerWithApi(input: RegisterRequest) {
  return postJson<RegisterResponseData, RegisterRequest>(REGISTER_PATH, {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.toLowerCase().trim(),
    password: input.password,
    ...(input.phone ? { phone: input.phone } : {}),
  });
}

export async function verifyEmailWithApi(token: string) {
  return postJson<VerifyEmailResponseData, { token: string }>(
    VERIFY_EMAIL_PATH,
    { token },
  );
}

const FORGOT_PASSWORD_PATH = '/api/v1/auth/forgot-password';
const RESET_PASSWORD_PATH = '/api/v1/auth/reset-password';

export async function forgotPasswordWithApi(email: string) {
  return postJson<{ message: string }, { email: string }>(
    FORGOT_PASSWORD_PATH,
    { email: email.toLowerCase().trim() },
  );
}

export async function resetPasswordWithApi(token: string, password: string) {
  return postJson<{ message: string }, { token: string; password: string }>(
    RESET_PASSWORD_PATH,
    { token, password },
  );
}
