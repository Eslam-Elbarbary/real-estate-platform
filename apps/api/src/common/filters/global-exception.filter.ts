import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { buildErrorResponse } from '../interfaces/api-response.interface';
import { AppLoggerService } from '../logger/app-logger.service';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext(GlobalExceptionFilter.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const { message, errors } = this.extractMessageAndErrors(exceptionResponse, exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        message,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`${status} ${request.method} ${request.url} — ${message}`);
    }

    response.status(status).json(buildErrorResponse(message, status, request.url, errors));
  }

  private extractMessageAndErrors(
    exceptionResponse: string | object | null,
    exception: unknown,
  ): { message: string; errors?: unknown } {
    if (typeof exceptionResponse === 'string') {
      return { message: exceptionResponse };
    }

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const body = exceptionResponse as {
        message?: string | string[];
        error?: string;
      };

      if (Array.isArray(body.message)) {
        return {
          message: 'Validation failed',
          errors: body.message,
        };
      }

      if (typeof body.message === 'string') {
        return { message: body.message };
      }

      if (typeof body.error === 'string') {
        return { message: body.error };
      }
    }

    if (exception instanceof Error && exception.message) {
      return { message: exception.message };
    }

    return { message: 'Internal server error' };
  }
}
