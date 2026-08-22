import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

const defaultOptions: ValidationPipeOptions = {
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  stopAtFirstError: false,
};

/**
 * Factory for the global ValidationPipe used across the API.
 */
export function createGlobalValidationPipe(
  options: ValidationPipeOptions = {},
): ValidationPipe {
  return new ValidationPipe({
    ...defaultOptions,
    ...options,
  });
}
