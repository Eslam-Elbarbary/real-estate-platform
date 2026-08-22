import { cookies } from 'next/headers';
import type { UserNote } from '../types';

export const NOTES_COOKIE = 'demo_notes';

function parseNotes(raw: string | undefined): UserNote[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as UserNote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface NotesRepository {
  list(userId: string): Promise<UserNote[]>;
  create(userId: string, body: string): Promise<UserNote>;
}

export class CookieNotesRepository implements NotesRepository {
  private async read(): Promise<UserNote[]> {
    const jar = await cookies();
    return parseNotes(jar.get(NOTES_COOKIE)?.value);
  }

  private async write(notes: UserNote[]): Promise<void> {
    const jar = await cookies();
    jar.set(NOTES_COOKIE, JSON.stringify(notes), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  async list(_userId: string): Promise<UserNote[]> {
    void _userId;
    const notes = await this.read();
    return [...notes].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }

  async create(_userId: string, body: string): Promise<UserNote> {
    void _userId;
    const now = new Date().toISOString();
    const note: UserNote = {
      id: `note-${now.replace(/[^\d]/g, '')}`,
      body: body.trim(),
      createdAt: now,
      updatedAt: now,
    };
    const existing = await this.read();
    await this.write([note, ...existing]);
    return note;
  }
}

let notesRepository: NotesRepository | null = null;

export function getNotesRepository(): NotesRepository {
  if (!notesRepository) notesRepository = new CookieNotesRepository();
  return notesRepository;
}
