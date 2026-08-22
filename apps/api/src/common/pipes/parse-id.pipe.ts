import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

/** Ensures a route param is a non-empty string (UUID/cuid validation added later). */
@Injectable()
export class ParseIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException('Invalid id parameter');
    }
    return value.trim();
  }
}
