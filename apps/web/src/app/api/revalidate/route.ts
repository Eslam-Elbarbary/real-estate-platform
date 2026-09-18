import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

interface RevalidateBody {
  tag?: string;
  tags?: string[];
  path?: string;
  paths?: string[];
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET?.trim();
  const headerSecret = request.headers.get('x-revalidate-secret')?.trim();

  if (!secret || headerSecret !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const tags = [
    ...(body.tag ? [body.tag] : []),
    ...(Array.isArray(body.tags) ? body.tags : []),
  ].filter((tag, index, all) => tag.trim().length > 0 && all.indexOf(tag) === index);

  const paths = [
    ...(body.path ? [body.path] : []),
    ...(Array.isArray(body.paths) ? body.paths : []),
  ].filter((path, index, all) => path.trim().length > 0 && all.indexOf(path) === index);

  for (const tag of tags) {
    // Next.js 16 requires a cacheLife profile for immediate expiry.
    revalidateTag(tag, 'max');
  }
  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({
    ok: true,
    revalidated: true,
    tags,
    paths,
  });
}
