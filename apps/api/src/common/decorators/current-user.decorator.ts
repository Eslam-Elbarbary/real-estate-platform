import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUserPayload {
  sub: string;
  email?: string;
  roles?: string[];
}

/**
 * Extracts the authenticated user payload attached by JwtAuthGuard / JwtStrategy.
 * Foundation only — payload shape will expand with the auth module.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserPayload | undefined => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUserPayload }>();
    return request.user;
  },
);
