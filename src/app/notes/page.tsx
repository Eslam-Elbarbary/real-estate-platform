import { redirect } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo/metadata';
import { routes } from '@/config/routes';
import { getServerSession } from '@/features/auth/session';
import { NotesPage, activityCopy, getNotesService } from '@/features/activity';

export const metadata = createPageMetadata({
  title: activityCopy.notes.title,
  description: activityCopy.notes.seoDescription,
  path: routes.notes,
  noIndex: true,
});

export default async function NotesRoutePage() {
  const session = await getServerSession();
  if (!session) {
    redirect(
      `${routes.auth.login}?returnTo=${encodeURIComponent(routes.notes)}`,
    );
  }

  const notes = await getNotesService().list(session.user.id);
  return <NotesPage notes={notes} />;
}
