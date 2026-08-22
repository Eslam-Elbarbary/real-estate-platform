import { getNotesRepository } from './repository';
import type { UserNote } from '../types';

export class NotesService {
  constructor(private readonly repository = getNotesRepository()) {}

  list(userId: string): Promise<UserNote[]> {
    return this.repository.list(userId);
  }

  create(userId: string, body: string): Promise<UserNote> {
    return this.repository.create(userId, body);
  }
}

let notesService: NotesService | null = null;

export function getNotesService(): NotesService {
  if (!notesService) notesService = new NotesService();
  return notesService;
}
