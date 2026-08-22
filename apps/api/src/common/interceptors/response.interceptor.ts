import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { buildSuccessResponse } from '../interfaces/api-response.interface';

/**
 * Wraps successful controller results in the standard API envelope.
 * Controllers that already return `{ success: true, ... }` are left unchanged.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (this.isAlreadyEnveloped(data)) {
          return data;
        }

        return buildSuccessResponse(data ?? null, 'OK', request.url);
      }),
    );
  }

  private isAlreadyEnveloped(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      typeof (data as { success: unknown }).success === 'boolean'
    );
  }
}
