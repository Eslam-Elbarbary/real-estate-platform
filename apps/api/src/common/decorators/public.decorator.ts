import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as publicly accessible (skips JWT auth when guard is global). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
