import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/features/auth/session';

export async function GET(request: NextRequest) {
  await clearAdminSession();

  const loginUrl = new URL('/login', request.url);
  const reason = request.nextUrl.searchParams.get('reason');

  if (reason) {
    loginUrl.searchParams.set('reason', reason);
  }

  return NextResponse.redirect(loginUrl);
}
