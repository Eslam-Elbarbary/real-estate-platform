import { NextResponse } from 'next/server';
import { persistRefreshedAdminSession } from '@/features/auth/server-session';

export async function POST() {
  const accessToken = await persistRefreshedAdminSession();

  if (!accessToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({ success: true, accessToken });
}
