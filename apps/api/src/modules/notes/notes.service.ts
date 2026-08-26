import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NoteResponseDto, toNoteResponse } from './mapper/note.mapper';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    propertyId: string,
    dto: CreateNoteDto,
  ): Promise<NoteResponseDto> {
    await this.assertPropertyExists(propertyId);

    const note = await this.prisma.propertyNote.create({
      data: {
        userId,
        propertyId,
        content: dto.content.trim(),
      },
    });

    return toNoteResponse(note);
  }

  async list(userId: string): Promise<NoteResponseDto[]> {
    const notes = await this.prisma.propertyNote.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notes.map(toNoteResponse);
  }

  async update(
    userId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    await this.findOwnedOrThrow(userId, noteId);

    if (dto.content === undefined) {
      throw new BadRequestException('No fields to update');
    }

    const updated = await this.prisma.propertyNote.update({
      where: { id: noteId },
      data: { content: dto.content.trim() },
    });

    return toNoteResponse(updated);
  }

  async remove(userId: string, noteId: string): Promise<{ message: string }> {
    await this.findOwnedOrThrow(userId, noteId);
    await this.prisma.propertyNote.delete({ where: { id: noteId } });
    return { message: 'Note deleted' };
  }

  private async findOwnedOrThrow(userId: string, noteId: string) {
    const note = await this.prisma.propertyNote.findFirst({
      where: { id: noteId, userId },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  private async assertPropertyExists(propertyId: string): Promise<void> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }
  }
}
