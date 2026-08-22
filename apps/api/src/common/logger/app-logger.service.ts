import { ConsoleLogger, Injectable, LogLevel, Scope } from '@nestjs/common';

/**
 * Application logger — Nest ConsoleLogger with consistent context helpers.
 * Swap implementation later (Pino/Winston) without changing call sites.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class AppLoggerService extends ConsoleLogger {
  setContext(context: string): void {
    super.setContext(context);
  }

  setLogLevels(levels: LogLevel[]): void {
    super.setLogLevels(levels);
  }
}
