import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/** Extracts a route/query/body param by name (thin helper for controllers). */
export const RequestParam = createParamDecorator(
  (key: string, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
      body?: Record<string, unknown>;
    }>();

    return request.params?.[key] ?? request.query?.[key] ?? request.body?.[key];
  },
);
